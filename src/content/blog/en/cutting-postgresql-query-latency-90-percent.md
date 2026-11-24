---
title: "Cutting PostgreSQL Query Latency by 90% in High-Volume Go Systems"
description: "How we brought P95 PostgreSQL latency down from 9 seconds to 900ms in a Go backend by splitting scope resolution out of correlated subqueries, matching composite B-tree indexes to sort order, and trimming count joins."
lang: "en"
translationKey: "postgresql-query-latency-90-percent"
publishedAt: "2026-09-07"
updatedAt: "2026-11-23"
readingTime: "8 min read"
readingMinutes: 8
category: "PostgreSQL & Go Performance"
tags:
  - "PostgreSQL"
  - "Go (Golang)"
  - "Query Optimization"
  - "Database Indexing"
  - "k6 Load Testing"
  - "Backend Architecture"
keywords:
  - "PostgreSQL query optimization"
  - "Go SQL performance tuning"
  - "composite B-tree index PostgreSQL"
  - "correlated subquery optimization"
  - "SARGable SQL queries"
  - "Rois Faozi PostgreSQL case study"
metrics:
  - value: "9s -> 900ms"
    label: "P95 Query Latency"
  - value: "90%"
    label: "Latency Reduction"
  - value: "40,000+"
    label: "Simulated Records"
  - value: "6"
    label: "Query & Cache Fixes"
featured: true
draft: false
---

What takes 4ms against 500 local rows can easily freeze for 9 seconds under concurrent dashboard traffic.

That wall showed up during a `k6` stress run on a Go and PostgreSQL inventory service once `fleet_nodes` passed 40,000 rows. CPU and RAM looked idle on the database host, yet P95 response times climbed to 9 seconds. Scaling up the machine or burying endpoints under stale caches would only hide slow execution plans, so we instrumented each repository call and read `EXPLAIN (ANALYZE, BUFFERS)` on the worst offenders.

All examples below use a simplified synthetic schema (`fleet_nodes`, `accounts`, `child_groups`) instead of any production banking or private codebase.

---

## Measuring Storage Calls with Prometheus Histograms

Before rewriting SQL, wrapping repository methods in a lightweight Go observer exposed which operations actually burned wall-clock time:

```go
// Study helper for recording storage operation duration
func (s *Store) observeOp(op string, started time.Time, err error) {
	status := "ok"
	if err != nil {
		status = "error"
	}
	s.metrics.OpDuration.WithLabelValues(op, status).Observe(time.Since(started).Seconds())
}
```

Histogram buckets pointed straight at filtered list and count paths. No single missing index explained the entire 9-second stall; several small repository habits compounded once concurrency increased.

---

## Pulling Access Resolution Out of Correlated `EXISTS` Subqueries

In a multi-workspace system, callers have different visibility scopes. Some accounts can view every row globally, some manage a parent group and all of its child groups, and others are restricted to a single child group.

The original repository handled all of those cases inside one shared `EXISTS` subquery appended to every query:

```sql
-- STUDY EXAMPLE (BEFORE): Correlated EXISTS with disjunctive OR branches
SELECT n.id, n.label, n.state, n.registered_at
FROM fleet_nodes n
WHERE EXISTS (
    SELECT 1
    FROM accounts a
    LEFT JOIN account_scopes s ON s.account_id = a.id
    WHERE a.id = $1
      AND (
          a.is_global = TRUE
          OR (s.parent_group_id IS NOT NULL AND n.parent_group_id = s.parent_group_id)
          OR (
              s.parent_group_id IS NOT NULL
              AND EXISTS (
                  SELECT 1 FROM child_groups cg
                  WHERE cg.id = n.child_group_id
                    AND cg.parent_group_id = s.parent_group_id
              )
          )
          OR (s.child_group_id IS NOT NULL AND n.child_group_id = s.child_group_id)
      )
)
ORDER BY n.registered_at DESC
LIMIT 25 OFFSET 0;
```

Putting the caller's scope lookup and the row filter inside the same correlated `EXISTS` block prevents PostgreSQL from simplifying the plan ahead of time. Because the `OR` branches touch both `n.parent_group_id` and `n.child_group_id`, the planner cannot fold the expression into a single index lookup, even when the caller belongs to just one `child_group_id`.

Separating scope lookup from the main query solved this directly. Go resolves the caller's scope once (from session claims or a fast primary-key read on `accounts`), and a small builder emits only the SQL clause that applies to that caller:

```go
// STUDY EXAMPLE (AFTER): Build only the predicate required for the caller's scope
type AccessScope struct {
	IsGlobal      bool
	ParentGroupID string
	ChildGroupID  string
}

func buildScopePredicate(alias string, scope AccessScope, args *[]any) string {
	if scope.IsGlobal {
		return "1 = 1"
	}
	if scope.ChildGroupID != "" {
		*args = append(*args, scope.ChildGroupID)
		return fmt.Sprintf("%s.child_group_id = $%d", alias, len(*args))
	}
	if scope.ParentGroupID != "" {
		*args = append(*args, scope.ParentGroupID)
		ref := fmt.Sprintf("$%d", len(*args))
		return fmt.Sprintf(
			"(%s.parent_group_id = %s OR EXISTS (SELECT 1 FROM child_groups cg WHERE cg.id = %s.child_group_id AND cg.parent_group_id = %s))",
			alias, ref, alias, ref,
		)
	}
	return "1 = 0"
}
```

When a global account requests the page, the `WHERE` clause simplifies to `1 = 1`. When a single-group operator requests it, PostgreSQL receives `WHERE n.child_group_id = $1`, which goes straight to a B-tree index.

---

## Matching Composite B-Tree Indexes to Both Filter and Sort Order

Simplifying the `WHERE` clause exposed the next problem in the execution plan: sorting.

When a query filters by `child_group_id = $1` and orders by `registered_at DESC LIMIT 25`, a single-column index on `(child_group_id)` still forces PostgreSQL to read every matching row for that group and sort them in memory before taking the top 25.

Composite indexes pairing each scope column with the descending timestamp fix that bottleneck, alongside a covering composite index for status aggregation:

```sql
-- Composite indexes for scoped pagination
CREATE INDEX IF NOT EXISTS idx_fleet_nodes_child_registered
    ON fleet_nodes (child_group_id, registered_at DESC);

CREATE INDEX IF NOT EXISTS idx_fleet_nodes_parent_registered
    ON fleet_nodes (parent_group_id, registered_at DESC);

-- Composite index for status summary aggregation
CREATE INDEX IF NOT EXISTS idx_fleet_nodes_state_groups
    ON fleet_nodes (state, parent_group_id, child_group_id);
```

With `(child_group_id, registered_at DESC)` in place, the executor walks the index in reverse-chronological order and stops once 25 rows match. Sorting moves off the heap completely, which shows up right away under `EXPLAIN (ANALYZE, BUFFERS)`.

---

## Removing `LOWER(COALESCE(...))` Wrappers from Indexed Columns

Even with the right composite index, wrapping a column in a function disables standard B-tree seeks on that column. Several queries used defensive string wrappers around `state`:

```sql
-- BEFORE: Function wrapper blocks direct index seeks on n.state
WHERE LOWER(COALESCE(n.state, '')) = $2
ORDER BY
    CASE WHEN LOWER(COALESCE(n.state, '')) = 'active' THEN 0 ELSE 1 END,
    n.registered_at DESC
```

Because `fleet_nodes.state` already stores canonical lowercase values (`'active'`, `'inactive'`), computing `LOWER(COALESCE(n.state, ''))` on every row during filtering and sorting was pure overhead.

Moving input normalization into Go (`strings.ToLower(strings.TrimSpace(rawState))`) before binding query arguments allows a direct column comparison:

```sql
-- AFTER: Direct column comparison
WHERE n.state = $2
ORDER BY
    CASE WHEN n.state = 'active' THEN 0 ELSE 1 END,
    n.registered_at DESC
```

---

## Dropping Unused Joins in `COUNT(*)` and Trimming List Payloads

Pagination endpoints typically issue a row total alongside the 25-row page fetch. Both paths did redundant work.

The row-counting statement unconditionally joined `node_metadata`, a 1:1 satellite table storing runtime attributes:

```sql
-- BEFORE: Unconditional 1:1 join inside COUNT(*)
SELECT COUNT(*)
FROM fleet_nodes n
LEFT JOIN node_metadata m ON m.node_id = n.id
WHERE n.child_group_id = $1;
```

Because `node_metadata` pairs 1:1 with `fleet_nodes`, joining it when `filter.RuntimeVersion == ""` forced tens of thousands of wasted B-tree lookups with zero impact on the final total. Conditional SQL assembly in Go omits that join unless a version filter is supplied:

```go
// AFTER: Only join node_metadata when filtering on its columns
metadataJoin := ""
if filter.RuntimeVersion != "" {
	metadataJoin = "LEFT JOIN node_metadata m ON m.node_id = n.id"
}

stmt := fmt.Sprintf(`
	SELECT COUNT(*)
	FROM fleet_nodes n
	%s
	WHERE %s
`, metadataJoin, whereClause)
```

Page fetches suffered from another habit: reusing the full single-record detail projection pulled wide telemetry snapshots, multi-kilobyte `JSONB` hardware profiles, and a per-row scalar query inside `SELECT` to fetch tag names. Splitting out a slim projection keeps page loads cheap. Heavy `JSONB` payloads stay on detail screens, and the scalar lookup becomes a plain `LEFT JOIN`.

---

## Opt-In Live Metrics and a 3-Second LRU Cache

Two final fixes cut wasted work outside the main table scan:

- Default asset views no longer contact Redis on every fetch just to attach live heartbeat metrics. Moving Redis lookups behind an explicit `?include=live_metrics` flag keeps routine pages solely on PostgreSQL.
- Status counters (`active`, `inactive`, `total`) see continuous polling from dozens of open browser tabs. Adding an in-memory `expirable.LRU` (`hashicorp/golang-lru/v2/expirable`) with a short TTL absorbs bursts per scope without outdated UI figures.

```go
// 3-second bounded LRU cache for summary counts
if summary, ok := s.summaryCache.Get(cacheKey); ok {
	return summary, nil
}
summary, err := s.fetchSummaryCounts(ctx, scope)
if err == nil {
	s.summaryCache.Add(cacheKey, summary)
}
return summary, err
```

Across our concurrency suite, tail latency dropped by 90%, landing at 900ms under load.

---

## Guarding Code Reviews in CI

Speedups erode fast. One careless PR can undo months of tuning overnight. Pair `go-sqlmock` unit assertions that enforce omitted satellite joins with execution-plan checks whenever a teammate introduces fresh sort keys or scope predicates before merging to `main`.

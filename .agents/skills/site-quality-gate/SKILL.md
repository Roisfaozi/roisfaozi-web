---
name: site-quality-gate
description: >-
  Use before committing changes, after modifying UI components, styles, layouts, blog articles, SEO/GEO files, Netlify routing, or before deploying roisfaozi-web.
  Runs typechecking, Astro production build, automated compliance/NDA/JSON-LD/XML/humanizer audits, and Lighthouse 100/100 checks.
---

# Site Quality Gate

Run this gate before finalizing any pull request, release, or significant edit in `roisfaozi-web`.

## 1. Run Automated Build & Compliance Gate

```bash
npm run check
```

This command runs in sequence:
1. `ASTRO_TELEMETRY_DISABLED=1 astro sync`
2. `tsc --noEmit`
3. `ASTRO_TELEMETRY_DISABLED=1 astro build`
4. `node .agents/skills/site-quality-gate/scripts/audit-site.mjs`

Never run `npx astro check` (it is not installed and hangs prompting for package installation).

## 2. Run Lighthouse Check on UI, Font, Image, or Route Changes

When modifying Astro components, Tailwind styles, CSS, fonts, images, `Layout.astro`, or adding new pages, audit the production preview on Mobile and Desktop (do not leave background preview processes running):

```bash
bash -c '
npx astro preview --port 4399 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null || true" EXIT
sleep 2

for path in "/" "/blog" "/blog/cutting-postgresql-query-latency-90-percent"; do
  npx lighthouse "http://localhost:4399${path}" \
    --no-enable-error-reporting \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
    --output=json --output-path="/tmp/lh-gate.json" --quiet
  node -e "
    const r = require(\"/tmp/lh-gate.json\");
    const s = Object.fromEntries(Object.entries(r.categories).map(([k,v]) => [k, Math.round(v.score * 100)]));
    console.log(\"${path} (mobile):\", JSON.stringify(s));
  "
done
'
```

Verify targets:
- Performance >= 99 (aim for 100 on blog pages and desktop).
- Accessibility, Best Practices, SEO, and Agentic Browsing = 100.

## 3. Clean Tree Review

Run `git status --short` and verify:
- No static `public/sitemap.xml` was recreated.
- No temporary scratch artifacts or screenshots were left inside `src/`, `public/`, or the repo root.
- Wait for explicit user confirmation before running `git commit` or `git push`.

---
name: publish-blog-post
description: >-
  Use when authoring, translating, updating, auditing, or humanizing blog articles for roisfaozi-web (src/content/blog/en and src/content/blog/id).
  Enforces NDA sanitization via synthetic study schemas, paired EN/ID slugs, English unslop + antislop-copywriting, Indonesian humanizer-indonesia (adhiprib --preset semiformal), llms.txt sync, and npm run check.
---

# Publish Blog Post Workflow

Follow these steps in order whenever creating, translating, or editing any blog post under `src/content/blog/`.

## 1. Scope & NDA Sanitization

- Never expose private client names, unpublished corporate hierarchies, role IDs, production database schemas, real repository method names, internal API paths, or credentials.
- Abstract every real-world case study into a synthetic study domain (such as `fleet_nodes`, `node_metadata`, `accounts`, `child_groups`) while preserving authentic engineering mechanics and benchmark lessons.
- Keep punctuation free of em dashes and en dashes across prose, titles, descriptions, code comments, tables, and frontmatter.

## 2. Draft Paired EN & ID Markdown Files

- Use the exact frontmatter structure defined in [resources/post-template.md](./resources/post-template.md) and validated by [src/content/config.ts](../../../src/content/config.ts).
- Store matching slugs in both directories so Netlify Edge geo-routing (`netlify/edge-functions/geo-blog.ts`) maps `/blog/<slug>` to `/id/blog/<slug>` in O(1):
  - `src/content/blog/en/<slug>.md` (`lang: "en"`)
  - `src/content/blog/id/<slug>.md` (`lang: "id"`)
- Set the exact same `translationKey` string on both files.
- A bespoke `1200x630` PNG OpenGraph card (`/og/en/<slug>.png` and `/og/id/<slug>.png`) is generated automatically at build time from frontmatter `title`, `description`, `category`, `publishedAt`, and `readingTime`. Set `ogImage: "/images/custom-og.png"` only if overriding with a custom image.

## 3. Humanize English Article (`en/<slug>.md`)

- Apply global skills `unslop` and `antislop-copywriting` (`~/.agents/skills/unslop/` and `~/.agents/skills/antislop-copywriting/`).
- Avoid preview-then-fulfill intros, scaffold paragraph openers (`First,`, `Second,`, `Finally,`), staccato fragments, and closing recap tables that echo opening vocabulary.
- Extract the Markdown body after YAML frontmatter (`split("---", 2)[2]`) and run all three `unslop` scanners:
  ```bash
  python3 -c '
  import subprocess
  body = open("src/content/blog/en/<slug>.md").read().split("---", 2)[2].strip()
  for script in ["banned_phrase_scan.py", "structure_scan.py", "silhouette_scan.py"]:
      r = subprocess.run(["python3", f"/home/user/.agents/skills/unslop/scripts/{script}"], input=body, text=True)
      print(script, "exit", r.returncode)
  '
  ```
- Target: zero `banned_phrase_scan` violations, `silhouette_penalty < 1.0`, zero scaffold openers, and zero heading preview overlaps.

## 4. Humanize Indonesian Article (`id/<slug>.md`)

- Apply ONLY global `humanizer-indonesia` (`adhiprib`) at `~/.agents/skills/humanizer-indonesia/SKILL.md` with `--preset semiformal`.
- Do NOT use `apissaj/humanizer-id` or the author sample `references/voice-prib-id.md`. Use a neutral semi-formal technical blog voice (or the owner's `references/voice-rois-id.md` if created later).
- Eliminate English-to-Indonesian calques (Langkah 5b), inanimate-subject personification and colloquial idioms (Langkah 5c), fragmented choppy sentences (Langkah 5d), colons left dangling directly before fenced code blocks, 3-item AI triplets, and unnecessary prose bullet lists.
- Italicize unabsorbed foreign terms in running prose, use Indonesian equivalents consistently, and keep code identifiers, SQL keywords, commands, and product names upright/monospace.
- Measure clean prose (frontmatter, code blocks, horizontal rules, and headings stripped) using `metrik.py`:
  ```bash
  python3 -c '
  import re, subprocess
  body = open("src/content/blog/id/<slug>.md").read().split("---", 2)[2].strip()
  prose = re.sub(r"```[\s\S]*?```", "", body)
  prose = re.sub(r"(?m)^---+\s*$", "", prose)
  prose = re.sub(r"(?m)^#{1,6}\s+.*$", "", prose)
  prose = re.sub(r"\n{3,}", "\n\n", prose).strip()
  subprocess.run(["python3", "/home/user/.agents/skills/humanizer-indonesia/scripts/metrik.py", "-", "--preset", "semiformal"], input=prose, text=True, check=True)
  '
  ```
- Every thresholded row must print `LULUS` and all zero-target diagnostics must be `0`.

## 5. Sync GEO Discovery Files

- Add the new article's EN and ID URLs and concise factual summary to:
  - `public/llms.txt`
  - `public/llms-full.txt`
- Verify `public/sitemap.xml` does NOT exist (`/sitemap.xml` and `/rss.xml` are generated dynamically by `src/pages/sitemap.xml.ts` and `src/pages/rss.xml.ts`).

## 6. Run Quality Gate

- Execute `npm run check` and fix every reported issue before committing.
- If the post introduces custom visual assets, run `.agents/skills/site-quality-gate/SKILL.md` Lighthouse verification on `/blog/<slug>` and `/id/blog/<slug>`.

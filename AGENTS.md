# Project Instructions: roisfaozi-web

Static Astro 4 + Tailwind CSS 3 + TypeScript portfolio and bilingual geo-routed blog for Rois Faozi (`https://roisfaozi.com`), deployed on Netlify (`dist/`, `netlify/edge-functions/geo-blog.ts`).

## Workflow Skills (Load on Demand)

- Writing, translating, editing, or humanizing blog articles: read `.agents/skills/publish-blog-post/SKILL.md`.
- Pre-commit verification, UI/SEO/GEO changes, or release checks: read `.agents/skills/site-quality-gate/SKILL.md` and run `npm run check`.

## Design & Accessibility Lock

- Theme: `#09090b` obsidian background (`bg-neutral-primary`), `zinc-*` surfaces, single `#10b981` emerald accent (`emerald-400`/`500`), `Geist Sans` + `Geist Mono` loaded locally.
- Shapes & Icons: `rounded-full` buttons/pills, `rounded-2xl` cards, `rounded-xl` inner/code blocks. Use Phosphor Icons via `astro-icon` only; keep only the existing `<R>` SVG logo in `src/components/Navbar.astro`.
- Prose & Copy Hygiene: Use standard hyphens `-`, colons `:`, or commas `,` cleanly (zero em dashes or en dashes anywhere in prose, metadata, UI copy, or feeds). Write real role titles (never `"UI Engineer"` or placeholder project names like `"Nexus"`). Avoid uppercase wide-tracked eyebrow labels above headlines.
- Contrast & A11y: Never use `text-zinc-500` on dark backgrounds (minimum `text-zinc-400`). Underline inline `<a>` links inside body text (`underline underline-offset-4`). When repeated link text targets different URLs, give each an `aria-label` starting with the exact visible label.

## Performance Lock (Lighthouse 100/100)

- Keep `build.inlineStylesheets: 'always'` in `astro.config.mjs` and keep GSAP uninstalled (animations use `.js-reveal` + `IntersectionObserver` in `src/layouts/Layout.astro`).
- Never hide Hero elements on first paint or run synchronous DOM layout reads (`getBoundingClientRect()`, `innerHeight`) during HTML parse.
- Set `preloadHero={true}` ONLY on `src/pages/index.astro`. Keep `decoding="sync"` on Hero LCP images and `loading="lazy" decoding="async"` below the fold.
- In `src/components/Navbar.astro`, preserve single-line desktop height (<= 80px) and resolve `#anchors` directly on `/` vs `/#anchors` on subpages.

## Bilingual Blog, GEO & Humanizer Rules

- Blog Collection: Author paired Markdown articles using the **same slug** under `src/content/blog/en/<slug>.md` (`lang: "en"`) and `src/content/blog/id/<slug>.md` (`lang: "id"`). `netlify/edge-functions/geo-blog.ts` maps `/blog/*` -> `/id/blog/*` for Indonesian visitors (`country === 'ID'`), respects the `blog_lang` cookie toggle, and bypasses search/AI crawlers.
- Dynamic Discovery: `src/pages/sitemap.xml.ts` and `src/pages/rss.xml.ts` build `/sitemap.xml` and `/rss.xml` automatically. Never re-create a static `public/sitemap.xml`. Keep `public/llms.txt` and `public/llms-full.txt` updated whenever adding projects or articles.
- Humanizer Routing:
  - English posts: use global `unslop` + `antislop-copywriting` (check via `banned_phrase_scan.py`, `structure_scan.py`, `silhouette_scan.py`).
  - Indonesian posts: use global `humanizer-indonesia` (`adhiprib`, `--preset semiformal`, neutral semiformal blog voice or user-authored `voice-rois-id.md`; never use `voice-prib-id.md` and never use `apissaj/humanizer-id` on this repo).

## Privacy & NDA Firewall

- Never expose personal phone numbers, unpublished client entities, or real production codebases (actual repository method names, private API paths, internal database schemas/columns, organizational tier names, or role IDs). Always demonstrate engineering patterns with synthetic study models (`fleet_nodes`, `node_metadata`, etc.).

## Environment Gotchas

- Never run `npx astro check` (`@astrojs/check` is not installed and blocks on interactive install prompt). Always run `npm run check`.
- Use `npm run build && npm run preview` if `npm run dev` hits Linux inotify limits (`ENOSPC`).
- Run Lighthouse CLI with `--no-enable-error-reporting --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet`.

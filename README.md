# Rois Faozi Portfolio

Static portfolio website built with Astro and Tailwind CSS.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Structure

- `src/pages/index.astro` — homepage composition.
- `src/layouts/Layout.astro` — document shell, SEO metadata, analytics.
- `src/components/` — visual sections: navbar, hero, story, projects, contact, scroll top, footer.
- `src/content/projects/` — project content collection.
- `public/projects/` — project preview images used by content files.

## Content Updates

Add or edit project cards in `src/content/projects/*.md`. Use `featured: true` to show a project on homepage and `order` to control sorting.

# Blog Post Frontmatter Templates

Use matching filenames (`src/content/blog/en/<slug>.md` and `src/content/blog/id/<slug>.md`), valid ISO `YYYY-MM-DD` dates, and zero em or en dashes.

## English (`src/content/blog/en/<slug>.md`)

```yaml
---
title: "Clear, Specific Engineering Title"
description: "One-sentence factual summary stating mechanism and measurable outcome."
lang: "en"
translationKey: "<slug>"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingTime: "7 min read"
readingMinutes: 7
category: "Backend Engineering"
tags:
  - "Go (Golang)"
  - "PostgreSQL"
keywords:
  - "keyword one"
  - "keyword two"
metrics:
  - value: "90%"
    label: "Metric Label"
featured: false
draft: false
---
```

## Indonesian (`src/content/blog/id/<slug>.md`)

```yaml
---
title: "Judul Teknis Bahasa Indonesia yang Spesifik"
description: "Ringkasan satu kalimat mengenai mekanisme perbaikan dan dampak terukurnya."
lang: "id"
translationKey: "<slug>"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingTime: "7 menit baca"
readingMinutes: 7
category: "Arsitektur Backend"
tags:
  - "Go (Golang)"
  - "PostgreSQL"
keywords:
  - "kata kunci satu"
  - "kata kunci dua"
metrics:
  - value: "90%"
    label: "Label Metrik"
featured: false
draft: false
---
```

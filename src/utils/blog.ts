import { getCollection, type CollectionEntry } from 'astro:content'

export type BlogLang = 'en' | 'id'
export type BlogEntry = CollectionEntry<'blog'>

export function getArticleSlug(entry: BlogEntry): string {
  return entry.slug.replace(/^(en|id)\//, '')
}

export function getBlogPath(lang: BlogLang, slug?: string): string {
  const base = lang === 'id' ? '/id/blog' : '/blog'
  return slug ? `${base}/${slug}` : base
}

export function formatBlogDate(dateStr: string, lang: BlogLang): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export async function getPublishedBlogPosts(lang: BlogLang): Promise<BlogEntry[]> {
  const allPosts = await getCollection('blog', (entry) => !entry.data.draft && entry.data.lang === lang)
  return allPosts.sort(
    (left, right) =>
      new Date(right.data.publishedAt).getTime() - new Date(left.data.publishedAt).getTime(),
  )
}

export async function getAllPublishedBlogPosts(): Promise<BlogEntry[]> {
  const allPosts = await getCollection('blog', (entry) => !entry.data.draft)
  return allPosts.sort(
    (left, right) =>
      new Date(right.data.publishedAt).getTime() - new Date(left.data.publishedAt).getTime(),
  )
}

export const BLOG_UI_COPY = {
  en: {
    pageTitle: 'Engineering Blog | Rois Faozi - Go, PostgreSQL & Distributed Systems',
    pageDescription:
      'Production case studies and architectural write-ups by Rois Faozi on Go (Golang) backends, PostgreSQL query tuning, MQTT/WebSockets IoT telemetry, and enterprise system design.',
    heading: 'Engineering Notes.',
    subheading:
      'Deep technical case studies from production systems: Go backends, PostgreSQL query optimization, high-throughput telemetry, and multi-schema architecture.',
    featuredBadge: 'Case Study',
    readArticle: 'Read article',
    backToBlog: 'Back to all articles',
    backToHome: 'Portfolio Home',
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
    languageLabel: 'Language',
    switchLangHint:
      'Language is detected automatically by region (Indonesia serves Bahasa Indonesia; outside Indonesia serves English). You can switch manually above anytime.',
    rssLabel: 'RSS Feed',
    authorRole: 'Full-Stack Developer (Go & TypeScript)',
    authorBio:
      'Building high-throughput Go backends, PostgreSQL multi-schema systems, and TypeScript web applications for enterprise banking, healthcare QMS/EMR, and open-source manufacturing ERP.',
    ctaHeading: 'Building a latency-critical backend or enterprise platform?',
    ctaBody:
      'I am available for remote Full-Stack or Go Backend engineering roles and technical architecture consulting.',
    ctaButton: 'Discuss a Project',
    readInOtherLang: 'Baca artikel ini dalam Bahasa Indonesia',
    otherLangName: 'Bahasa Indonesia',
    fallbackNotice: '',
  },
  id: {
    pageTitle: 'Blog Engineering | Rois Faozi - Go, PostgreSQL & Sistem Terdistribusi',
    pageDescription:
      'Studi kasus produksi dan catatan arsitektur oleh Rois Faozi seputar backend Go (Golang), optimasi query PostgreSQL, telemetri IoT MQTT/WebSockets, dan desain sistem enterprise.',
    heading: 'Catatan Engineering.',
    subheading:
      'Studi kasus teknis mendalam dari sistem produksi nyata: backend Go, optimasi query PostgreSQL, telemetri throughput tinggi, dan arsitektur multi-skema.',
    featuredBadge: 'Studi Kasus',
    readArticle: 'Baca artikel',
    backToBlog: 'Kembali ke daftar artikel',
    backToHome: 'Beranda Portofolio',
    publishedLabel: 'Diterbitkan',
    updatedLabel: 'Diperbarui',
    languageLabel: 'Bahasa',
    switchLangHint:
      'Bahasa disesuaikan otomatis berdasarkan wilayah akses (Indonesia menampilkan Bahasa Indonesia; luar Indonesia menampilkan Bahasa Inggris). Anda dapat menggantinya secara manual kapan saja.',
    rssLabel: 'Feed RSS',
    authorRole: 'Full-Stack Developer (Go & TypeScript)',
    authorBio:
      'Membangun backend Go berkinerja tinggi, sistem multi-skema PostgreSQL, dan aplikasi web TypeScript untuk perbankan enterprise, QMS/RME rumah sakit, serta ERP manufaktur open-source.',
    ctaHeading: 'Sedang membangun backend kritis atau platform enterprise?',
    ctaBody:
      'Saya terbuka untuk kolaborasi remote Full-Stack atau Go Backend Engineer serta konsultasi arsitektur teknis.',
    ctaButton: 'Diskusikan Proyek',
    readInOtherLang: 'Read this article in English',
    otherLangName: 'English',
    fallbackNotice:
      'Artikel ini saat ini baru tersedia dalam Bahasa Inggris. Menampilkan versi asli Bahasa Inggris.',
  },
} as const

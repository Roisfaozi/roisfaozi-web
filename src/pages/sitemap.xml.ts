import type { APIRoute } from 'astro'
import { seoMeta } from '../data/profile'
import { getArticleSlug, getBlogPath, getPublishedBlogPosts } from '../utils/blog'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || seoMeta.siteUrl
  const enPosts = await getPublishedBlogPosts('en')
  const idPosts = await getPublishedBlogPosts('id')

  const latestBlogDate =
    enPosts.length > 0
      ? enPosts[0].data.updatedAt || enPosts[0].data.publishedAt
      : '2026-11-20'

  const idSlugMap = new Map(idPosts.map((post) => [getArticleSlug(post), post]))

  const postEntriesXml = enPosts
    .map((enPost) => {
      const slug = getArticleSlug(enPost)
      const idPost = idSlugMap.get(slug)
      const enUrl = `${siteUrl}${getBlogPath('en', slug)}`
      const idUrl = `${siteUrl}${getBlogPath('id', slug)}`
      const enLastMod = enPost.data.updatedAt || enPost.data.publishedAt
      const idLastMod = idPost
        ? idPost.data.updatedAt || idPost.data.publishedAt
        : enLastMod

      const alternatesBlock = [
        `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />`,
        `    <xhtml:link rel="alternate" hreflang="id" href="${escapeXml(idUrl)}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}" />`,
      ].join('\n')

      const enOgLoc = enPost.data.ogImage
        ? new URL(enPost.data.ogImage, `${siteUrl}/`).href
        : `${siteUrl}/og/en/${slug}.png`
      const idOgLoc = idPost?.data.ogImage
        ? new URL(idPost.data.ogImage, `${siteUrl}/`).href
        : `${siteUrl}/og/id/${slug}.png`
      const idTitle = idPost ? idPost.data.title : enPost.data.title

      return `  <url>
    <loc>${escapeXml(enUrl)}</loc>
    <lastmod>${enLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${alternatesBlock}
    <image:image>
      <image:loc>${escapeXml(enOgLoc)}</image:loc>
      <image:title>${escapeXml(enPost.data.title)}</image:title>
    </image:image>
  </url>
  <url>
    <loc>${escapeXml(idUrl)}</loc>
    <lastmod>${idLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${alternatesBlock}
    <image:image>
      <image:loc>${escapeXml(idOgLoc)}</image:loc>
      <image:title>${escapeXml(idTitle)}</image:title>
    </image:image>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>2026-11-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteUrl}/og-image.png</image:loc>
      <image:title>Rois Faozi - Full-Stack Developer (Go &amp; TypeScript)</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/images/hero-system.webp</image:loc>
      <image:title>Minimalist Dark Architectural Monolith - Rois Faozi Portfolio</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/projects/enterprise-dms.webp</image:loc>
      <image:title>Enterprise Banking DMS &amp; Digital Onboarding Case Study</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/projects/medistra-qms.webp</image:loc>
      <image:title>Hospital Queue Management System (QMS) - Medistra Hospital &amp; BitHealth</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/projects/sasi-simklinik.webp</image:loc>
      <image:title>SASI SIMKlinik Clinic &amp; Electronic Medical Record (RME) Platform</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/projects/carbon-erp.webp</image:loc>
      <image:title>Carbon Manufacturing ERP (crbnos/carbon) Open Source Contributions</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/projects/go-clean-arch.webp</image:loc>
      <image:title>Golang Clean Architecture &amp; Web API Blueprint</image:title>
    </image:image>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${latestBlogDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="id" href="${siteUrl}/id/blog" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/blog" />
  </url>
  <url>
    <loc>${siteUrl}/id/blog</loc>
    <lastmod>${latestBlogDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/blog" />
    <xhtml:link rel="alternate" hreflang="id" href="${siteUrl}/id/blog" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/blog" />
  </url>
${postEntriesXml}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

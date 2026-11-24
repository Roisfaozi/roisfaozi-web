import type { APIRoute } from 'astro'
import { profile, seoMeta } from '../data/profile'
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
  const allPosts = [...enPosts, ...idPosts].sort(
    (left, right) =>
      new Date(right.data.publishedAt).getTime() - new Date(left.data.publishedAt).getTime(),
  )

  const lastBuildDate =
    allPosts.length > 0
      ? new Date(`${allPosts[0].data.updatedAt || allPosts[0].data.publishedAt}T00:00:00Z`).toUTCString()
      : new Date().toUTCString()

  const itemsXml = allPosts
    .map((post) => {
      const slug = getArticleSlug(post)
      const url = `${siteUrl}${getBlogPath(post.data.lang, slug)}`
      const pubDate = new Date(`${post.data.publishedAt}T00:00:00Z`).toUTCString()
      const categories = post.data.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <author>${escapeXml(profile.email)} (${escapeXml(profile.name)})</author>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rois Faozi - Engineering Blog (Go, PostgreSQL &amp; Distributed Systems)</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>Production engineering case studies by Rois Faozi on Go (Golang) backends, PostgreSQL query optimization, MQTT/WebSockets IoT telemetry, and enterprise system architecture.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

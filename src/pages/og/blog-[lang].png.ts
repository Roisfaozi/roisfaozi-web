import type { APIRoute } from 'astro'
import { BLOG_UI_COPY, getPublishedBlogPosts, type BlogLang } from '../../utils/blog'
import { renderOgPng } from '../../utils/og'

export function getStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'id' } }]
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as BlogLang
  const ui = BLOG_UI_COPY[lang]
  const posts = await getPublishedBlogPosts(lang)

  const countLabel =
    lang === 'id'
      ? `${posts.length} Artikel Teknis`
      : `${posts.length} Technical ${posts.length === 1 ? 'Article' : 'Articles'}`

  const png = await renderOgPng({
    title: `${ui.heading} - Rois Faozi`,
    description: ui.subheading,
    category: lang === 'id' ? 'Blog Engineering' : 'Engineering Blog',
    meta: countLabel,
    lang,
    urlPath: lang === 'id' ? 'roisfaozi.com/id/blog' : 'roisfaozi.com/blog',
  })

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

import type { APIRoute } from 'astro'
import {
  formatBlogDate,
  getArticleSlug,
  getBlogPath,
  getPublishedBlogPosts,
  type BlogEntry,
  type BlogLang,
} from '../../../utils/blog'
import { renderOgPng } from '../../../utils/og'

export async function getStaticPaths() {
  const enPosts = await getPublishedBlogPosts('en')
  const idPosts = await getPublishedBlogPosts('id')

  const idMap = new Map(idPosts.map((post) => [getArticleSlug(post), post]))
  const allSlugs = new Set([
    ...enPosts.map((post) => getArticleSlug(post)),
    ...idPosts.map((post) => getArticleSlug(post)),
  ])

  const paths: Array<{
    params: { lang: BlogLang; slug: string }
    props: { lang: BlogLang; post: BlogEntry }
  }> = []

  for (const enPost of enPosts) {
    paths.push({
      params: { lang: 'en', slug: getArticleSlug(enPost) },
      props: { lang: 'en', post: enPost },
    })
  }

  for (const slug of allSlugs) {
    const idPost = idMap.get(slug)
    const fallbackPost = enPosts.find((post) => getArticleSlug(post) === slug)
    const chosen = idPost || fallbackPost
    if (chosen) {
      paths.push({
        params: { lang: 'id', slug },
        props: { lang: 'id', post: chosen },
      })
    }
  }

  return paths
}

export const GET: APIRoute = async ({ params, props }) => {
  const { lang, post } = props as { lang: BlogLang; post: BlogEntry }
  const slug = params.slug!
  const urlPath = `roisfaozi.com${getBlogPath(lang, slug)}`
  const meta = `${formatBlogDate(post.data.publishedAt, lang)}  |  ${post.data.readingTime}`

  const png = await renderOgPng({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    meta,
    lang,
    urlPath,
  })

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

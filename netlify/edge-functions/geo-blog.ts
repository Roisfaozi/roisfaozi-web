interface NetlifyCookieOptions {
  name: string
  value: string
  path?: string
  maxAge?: number
  sameSite?: 'Lax' | 'Strict' | 'None'
}

interface NetlifyEdgeContext {
  geo?: {
    country?: {
      code?: string
    }
  }
  cookies: {
    get(name: string): string | undefined
    set(options: NetlifyCookieOptions): void
  }
  next(): Promise<Response>
}

const CRAWLER_USER_AGENT_REGEX =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|linkedinbot|twitterbot|slackbot|whatsapp|telegrambot|discordbot|oai-searchbot|chatgpt-user|gptbot|perplexitybot|claudebot|claude-searchbot|applebot|duckassistbot|lighthouse|chrome-lighthouse|pagespeed/i

export default async function geoBlogHandler(
  request: Request,
  context: NetlifyEdgeContext,
): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return context.next()
  }

  const userAgent = request.headers.get('user-agent') || ''
  if (CRAWLER_USER_AGENT_REGEX.test(userAgent)) {
    return context.next()
  }

  const url = new URL(request.url)
  const cleanPathname =
    url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')

  // Only handle English /blog and /blog/* entry points
  if (cleanPathname !== '/blog' && !cleanPathname.startsWith('/blog/')) {
    return context.next()
  }

  // Allow explicit ?lang=en or ?lang=id override via query string
  const explicitLang = url.searchParams.get('lang')
  if (explicitLang === 'en' || explicitLang === 'id') {
    context.cookies.set({
      name: 'blog_lang',
      value: explicitLang,
      path: '/',
      maxAge: 31536000,
      sameSite: 'Lax',
    })
    url.searchParams.delete('lang')
    const targetPath =
      explicitLang === 'id' ? `/id${cleanPathname}` : cleanPathname
    const redirectUrl = new URL(`${targetPath}${url.search}`, url.origin)
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
        'Cache-Control': 'private, no-cache',
        Vary: 'Cookie, Country',
      },
    })
  }

  // Respect user's saved manual language cookie
  const savedLang = context.cookies.get('blog_lang')
  if (savedLang === 'en') {
    return context.next()
  }

  const countryCode = context.geo?.country?.code?.toUpperCase()
  const shouldServeIndonesian = savedLang === 'id' || countryCode === 'ID'

  if (shouldServeIndonesian) {
    const idTargetUrl = new URL(`/id${cleanPathname}${url.search}`, url.origin)
    return new Response(null, {
      status: 302,
      headers: {
        Location: idTargetUrl.toString(),
        'Cache-Control': 'private, no-cache',
        Vary: 'Cookie, Country',
      },
    })
  }

  return context.next()
}

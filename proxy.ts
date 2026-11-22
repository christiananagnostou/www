import { type NextRequest, NextResponse } from 'next/server'

import { HTML, MARKDOWN, pageFormat } from './lib/http/pageFormat'

export const config = { matcher: ['/', '/404'] }

export function proxy(request: NextRequest) {
  // Pages Router navigation fetches JSON, not a document representation.
  if (request.nextUrl.buildId || request.headers.has('x-nextjs-data') || !['GET', 'HEAD'].includes(request.method)) {
    return NextResponse.next()
  }

  const format = pageFormat(request.headers.get('accept'))
  const headers = { Vary: 'Accept' }
  const errorPage = request.nextUrl.pathname === '/404'
  if (format === MARKDOWN)
    return NextResponse.rewrite(new URL(errorPage ? '/404.md' : '/index.md', request.url), { headers })
  if (format === HTML || errorPage) return NextResponse.next({ headers })
  return new Response('Available formats: text/html and text/markdown.\n', {
    status: 406,
    headers: { ...headers, 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

import type { GetServerSideProps } from 'next'

import { SITE_ORIGIN } from '../lib/constants'
import { MARKDOWN, pageFormat } from '../lib/http/pageFormat'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('Vary', 'Accept')
  if (!['GET', 'HEAD'].includes(req.method ?? '') || pageFormat(req.headers.accept) !== MARKDOWN) {
    return { notFound: true }
  }
  res.statusCode = 404
  res.setHeader('Content-Type', MARKDOWN)
  res.setHeader('Cache-Control', 'no-store')
  res.end(
    req.method === 'HEAD'
      ? undefined
      : `# Page not found\n\nThere’s no published page at this address. Use the [site guide](${SITE_ORIGIN}/llms.txt) or [sitemap](${SITE_ORIGIN}/sitemap.xml) to find an existing page.\n`
  )
  return { props: {} }
}

export default function MarkdownNotFound() {
  return null
}

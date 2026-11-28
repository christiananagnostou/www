import dayjs from 'dayjs'
import type { GetServerSideProps } from 'next'
import type { ArticleType } from '../lib/articles'
import { getAllPosts } from '../lib/articles'
import { SITE_ORIGIN } from '../lib/constants'
import { ProjectState } from '../lib/projects'

/**
 * Dynamic sitemap served at /sitemap.xml
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let articles: ArticleType[] = []

  try {
    articles = getAllPosts({ allowNoList: true })
  } catch (err) {
    console.error('Failed to build sitemap:', err)
  }

  const staticPaths = [
    '/',
    '/art',
    '/articles',
    '/bookmarklets',
    '/contact',
    '/fitness',
    '/lab',
    '/privacy',
    '/projects',
  ]
  const allRoutes: { path: string; lastmod?: string }[] = [
    ...staticPaths.map((path) => ({ path })),
    ...articles.map(({ slug, lastUpdated, dateCreated }) => {
      const date = lastUpdated || dateCreated
      return { path: `/article/${slug}`, lastmod: date ? dayjs(date).format('YYYY-MM-DD') : undefined }
    }),
    ...ProjectState.map(({ slug }) => ({ path: `/work/${slug}` })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>${r.lastmod ? `\n    <lastmod>${r.lastmod}</lastmod>` : ''}\n  </url>`
    )
    .join('\n')}\n</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null // Response is generated in getServerSideProps
}

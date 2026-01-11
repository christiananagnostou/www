import dayjs from 'dayjs'
import type { GetServerSideProps } from 'next'
import type { ArticleType } from '../lib/articles'
import { getAllPosts } from '../lib/articles'
import type { ProjectType } from '../lib/projects'
import { ProjectState } from '../lib/projects'

/**
 * Dynamic sitemap served at /sitemap.xml
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let articles: ArticleType[] = []
  let projects: ProjectType[] = []

  try {
    articles = getAllPosts({ allowNoList: true })
    projects = ProjectState
  } catch (err) {
    console.error('Failed to build sitemap:', err)
  }

  const now = dayjs().toISOString()

  const staticRoutes = [
    { path: '/', lastmod: now },
    { path: '/art', lastmod: now },
    { path: '/articles', lastmod: now },
    { path: '/bookmarklets', lastmod: now },
    { path: '/contact', lastmod: now },
    { path: '/lab', lastmod: now },
    { path: '/projects', lastmod: now },
  ]

  const articleRoutes = articles.map((a) => ({
    path: `/article/${a.slug}`,
    lastmod: a.dateCreated ? dayjs(a.dateCreated).toISOString() : now,
  }))

  const projectRoutes = projects.map((p) => ({
    path: `/work/${p.slug}`,
    lastmod: p.date ? dayjs(p.date).toISOString() : now,
  }))

  const allRoutes = [...staticRoutes, ...articleRoutes, ...projectRoutes]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes
    .map((r) => `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n  </url>`)
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

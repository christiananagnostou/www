import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/articles'
import { BASE_URL } from '../../lib/constants'
import { PageDescription, PageTitle } from '../articles'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const posts = getAllPosts()

  const rssItemsXml = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/article/${post.slug}`
      const postDate = dayjs(post.dateCreated).toISOString()
      return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${postUrl}</link>
        <pubDate>${postDate}</pubDate>
        <description><![CDATA[${post.summary || ''}]]></description>
      </item>
      `
    })
    .join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${PageTitle}]]></title>
    <link>${BASE_URL}</link>
    <description><![CDATA[${PageDescription}]]></description>
    ${rssItemsXml}
  </channel>
</rss>
`

  res.setHeader('Content-Type', 'text/xml')
  res.status(200).send(rssXml)
}

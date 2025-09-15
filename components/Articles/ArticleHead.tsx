import dayjs from 'dayjs'
import Head from 'next/head'
import type { ArticleType } from '../../lib/articles'
import { BASE_URL, X_HANDLE } from '../../lib/constants'
import { getArticleStructuredData } from '../../lib/structured/article'

interface ArticleHeadProps {
  post: ArticleType
  prevArticle?: { slug: string; title: string }
  nextArticle?: { slug: string; title: string }
}

const ArticleHead = ({ post, prevArticle, nextArticle }: ArticleHeadProps) => {
  const { title, coverImg, dateCreated, lastUpdated, summary, slug, categories } = post
  const PageTitle = `${title}`
  const PageUrl = `${BASE_URL}/article/${slug}`

  return (
    <Head>
      <title>{PageTitle}</title>
      <meta content={summary} name="description" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link href={PageUrl} rel="canonical" />

      {/* Open Graph tags */}
      <meta content="article" property="og:type" />
      <meta content={PageUrl} property="og:url" />
      <meta content={PageTitle} property="og:title" />
      <meta content={summary} property="og:description" />
      {coverImg ? <meta content={coverImg} property="og:image" /> : null}

      {dateCreated ? <meta content={dayjs(dateCreated).toISOString()} property="article:published_time" /> : null}
      {lastUpdated ? <meta content={dayjs(lastUpdated).toISOString()} property="article:modified_time" /> : null}
      {categories?.map((cat) => (
        <meta key={cat} content={cat} property="article:tag" />
      ))}
      <meta content="Christian Anagnostou" property="article:author" />

      {/* Twitter Card tags */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={X_HANDLE} name="twitter:creator" />
      <meta content={PageTitle} name="twitter:title" />
      <meta content={summary} name="twitter:description" />
      {coverImg ? <meta content={coverImg} name="twitter:image" /> : null}

      {/* Structured Data (BlogPosting) */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getArticleStructuredData(post)) }}
        type="application/ld+json"
      />

      {/* Pagination Links */}
      {prevArticle ? <link href={`${BASE_URL}/article/${prevArticle.slug}`} rel="prev" /> : null}
      {nextArticle ? <link href={`${BASE_URL}/article/${nextArticle.slug}`} rel="next" /> : null}
    </Head>
  )
}

export default ArticleHead

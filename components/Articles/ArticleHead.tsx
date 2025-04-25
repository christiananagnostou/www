import Head from 'next/head'
import { BASE_URL, X_HANDLE } from '../../lib/constants'
import { getArticleStructuredData } from '../../lib/structured/article'
import { ArticleType } from '../../lib/articles'
import dayjs from 'dayjs'

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
      <meta name="description" content={summary} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={PageUrl} />

      {/* Open Graph tags */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={PageUrl} />
      <meta property="og:title" content={PageTitle} />
      <meta property="og:description" content={summary} />
      {coverImg && <meta property="og:image" content={coverImg} />}

      {dateCreated && <meta property="article:published_time" content={dayjs(dateCreated).toISOString()} />}
      {lastUpdated && <meta property="article:modified_time" content={dayjs(lastUpdated).toISOString()} />}
      {categories?.map((cat) => <meta key={cat} property="article:tag" content={cat} />)}
      <meta property="article:author" content="Christian Anagnostou" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={X_HANDLE} />
      <meta name="twitter:title" content={PageTitle} />
      <meta name="twitter:description" content={summary} />
      {coverImg && <meta name="twitter:image" content={coverImg} />}

      {/* Structured Data (BlogPosting) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getArticleStructuredData(post)) }}
      />

      {/* Pagination Links */}
      {prevArticle && <link rel="prev" href={`${BASE_URL}/article/${prevArticle.slug}`} />}
      {nextArticle && <link rel="next" href={`${BASE_URL}/article/${nextArticle.slug}`} />}
    </Head>
  )
}

export default ArticleHead

import { ArticleType } from '../articles'
import { BASE_URL } from '../constants'

export const getArticleStructuredData = (post: ArticleType) => {
  // Remove HTML tags from content to include as plain text
  const plainText = post.content.replace(/<[^>]+>/g, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/article/${post.slug}`,
    },
    headline: post.title,
    description: post.summary,
    image: post.coverImg ? post.coverImg : undefined,
    author: {
      '@type': 'Person',
      name: 'Christian Anagnostou',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Christian Anagnostou',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/A-circle.png`,
      },
    },
    datePublished: post.dateCreated,
    dateModified: post.lastUpdated || post.dateCreated,
    articleBody: plainText,
  }
}

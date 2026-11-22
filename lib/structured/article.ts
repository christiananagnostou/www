import type { ArticleType } from '../articles'
import { SITE_ORIGIN } from '../constants'
import { blogPosting } from './blogPosting'

export const getArticleStructuredData = (post: ArticleType) => {
  // Remove HTML tags from content to include as plain text
  const plainText = post.content.replace(/<[^>]+>/g, '')
  const identity = blogPosting(post)
  return {
    '@context': 'https://schema.org',
    ...identity,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': identity.url,
    },
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
        url: `${SITE_ORIGIN}/A-circle.png`,
      },
    },
    dateModified: post.lastUpdated || post.dateCreated,
    articleBody: plainText,
  }
}

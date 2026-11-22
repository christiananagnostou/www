import type { ArticleSummary } from '../articles'
import { BASE_URL } from '../constants'

export const articlesTitle = 'Articles | Christian Anagnostou'
export const articlesDescription = 'Explore articles on technology, innovative ideas, and inspiration.'
export const articlesUrl = `${BASE_URL}/articles`

export const getArticlesListStructuredData = (posts: ArticleSummary[]) => {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Articles',
      description: articlesDescription,
      url: articlesUrl,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.dateCreated,
          author: {
            '@type': 'Person',
            name: 'Christian Anagnostou',
          },
          description: post.summary || '',
          url: `${BASE_URL}/article/${post.slug}`,
          keywords: Array.isArray(post.categories) ? post.categories.join(', ') : '',
        },
      })),
    }),
  }
}

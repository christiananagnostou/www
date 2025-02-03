import { ArticleType } from '../articles'
import { BASE_URL } from '../constants'

export const getArticlesListStructuredData = (posts: ArticleType[], PageDescription: string, PageUrl: string) => {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Articles',
      description: PageDescription,
      url: PageUrl,
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

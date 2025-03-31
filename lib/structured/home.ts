import { ArticleType } from '../articles'
import { BASE_URL } from '../constants'

export const getHomeStructuredData = (posts: ArticleType[]) =>
  ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Christian Anagnostou',
    url: `${BASE_URL}`,
    description: "Christian Anagnostou's Web Portfolio",
    mainEntity: [
      {
        '@type': 'ItemList',
        name: 'Latest Articles',
        itemListElement: posts.slice(0, 3).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${BASE_URL}/article/${post.slug}`,
            datePublished: post.dateCreated,
            description: post.summary,
          },
        })),
      },
      {
        '@type': 'Person',
        name: 'Christian Anagnostou',
        url: `${BASE_URL}`,
        sameAs: ['https://twitter.com/javascramble', 'https://github.com/ChristianAnagnostou'],
      },
    ],
  }) as const

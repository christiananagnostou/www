import type { ArticleSummary } from '../articles'
import { SITE_ORIGIN } from '../constants'
import { blogPosting } from './blogPosting'

export const getHomeStructuredData = (posts: ArticleSummary[]) =>
  ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Christian Anagnostou',
    url: SITE_ORIGIN,
    description: "Christian Anagnostou's Web Portfolio",
    mainEntity: [
      {
        '@type': 'ItemList',
        name: 'Latest Articles',
        itemListElement: posts.slice(0, 3).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: blogPosting(post),
        })),
      },
      {
        '@type': 'Person',
        name: 'Christian Anagnostou',
        url: SITE_ORIGIN,
        sameAs: ['https://twitter.com/javascramble', 'https://github.com/ChristianAnagnostou'],
      },
    ],
  }) as const

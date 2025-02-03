import { bookmarkletsData } from '../bookmarklets'
import { BASE_URL } from '../constants'

export const getBookmarkletsStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Bookmarklets',
    description: 'A handy list of Bookmarklets by Christian Anagnostou',
    url: `${BASE_URL}/bookmarklets`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: bookmarkletsData.map((bookmarklet, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareSourceCode',
          name: bookmarklet.title,
          description: bookmarklet.description,
          codeRepository: bookmarklet.githubUrl,
          text: bookmarklet.code.trim(),
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'Instructions',
            value: bookmarklet.instructions.trim(),
          },
        },
      })),
    },
  }
}

import { SortedArtImages } from '../art'
import { BASE_URL } from '../constants'

export const getArtStructuredData = (images = SortedArtImages) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Photography Gallery',
    description: 'A gallery of photography capturing moments by Christian Anagnostou.',
    url: `${BASE_URL}/art`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: images.map((img, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'ImageObject',
          name: img.title,
          contentUrl: `${BASE_URL}${img.image.src}`,
          url: `${BASE_URL}${img.image.src}`,
          dateCreated: img.date,
        },
      })),
    },
  }
}

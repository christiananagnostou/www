import { StaticImageData } from 'next/image'
import { ArtState } from '../art'
import { BASE_URL } from '../constants'

export const getArtStructuredData = () => {
  const categories = Object.keys(ArtState)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Photography Gallery',
    description: 'A gallery of photography capturing moments by Christian Anagnostou.',
    url: `${BASE_URL}/art`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((category, catIndex) => ({
        '@type': 'ListItem',
        position: catIndex + 1,
        item: {
          '@type': 'ItemList',
          name: category,
          itemListElement: ArtState[category].map((img: StaticImageData, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'ImageObject',
              name: `${category} photo ${index + 1}`,
              contentUrl: `${BASE_URL}${img.src}`,
              url: `${BASE_URL}${img.src}`,
            },
          })),
        },
      })),
    },
  }
}

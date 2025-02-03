import { BASE_URL } from '../constants'
import { ProjectState } from '../projects'

export const getProjectsStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects',
    description:
      "A showcase of freelance, personal, and open-source projects by Christian Anagnostou. Carving and polishing this craft has been a passion of mine for over a decade and I've had the pleasure of working with some amazing people and companies along the way.",
    url: `${BASE_URL}/projects`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: ProjectState.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          url: project.externalLink || `${BASE_URL}/projects/${project.slug}`,
          image: project.desktopImgs?.[0]?.src ? `${BASE_URL}${project.desktopImgs[0].src}` : undefined,
          dateCreated: project.date,
          keywords: project.tags.join(', '),
        },
      })),
    },
  }
}

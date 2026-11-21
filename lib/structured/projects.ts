import { SITE_ORIGIN } from '../constants'
import type { ProjectType } from '../projects'

export const projectsUrl = SITE_ORIGIN + '/projects'
export const projectUrl = (slug: string) => SITE_ORIGIN + '/work/' + slug
export const projectsDescription =
  'A showcase of freelance, personal, and open-source projects by Christian Anagnostou.'

export function projectMetadata(project: ProjectType) {
  const url = projectUrl(project.slug)
  const cover = project.desktopImgs[0] ?? project.mobileImgs[0]
  const image = cover ? new URL(cover.src, SITE_ORIGIN).href : undefined
  const description =
    project.slug === 'liftclub'
      ? 'How Christian Anagnostou built Lift Club, a workout log for two cousins that grew into a community of more than 100 lifters.'
      : project.summary
  const author = { '@type': 'Person', name: 'Christian Anagnostou', url: SITE_ORIGIN }
  return {
    url,
    image,
    description,
    title: project.title + ' | Christian Anagnostou',
    structured: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url,
      url,
      name: project.title,
      description,
      author,
      image,
      isPartOf: { '@type': 'CollectionPage', '@id': projectsUrl },
      mainEntity: {
        '@type': project.slug === 'liftclub' ? 'WebApplication' : 'CreativeWork',
        name: project.title,
        url: project.externalLink ?? url,
        ...(project.slug === 'liftclub' && { applicationCategory: 'HealthApplication', screenshot: image }),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          ['Home', SITE_ORIGIN + '/'],
          ['Projects', projectsUrl],
          [project.title, url],
        ].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
      },
    },
  }
}

export const getProjectsStructuredData = (projects: ProjectType[]) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': projectsUrl,
  name: 'Projects',
  description: projectsDescription,
  url: projectsUrl,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: projects.map((project, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: project.title,
      url: projectUrl(project.slug),
    })),
  },
})

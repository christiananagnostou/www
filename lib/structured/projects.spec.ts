import { describe, expect, it } from 'vitest'

import type { ProjectType } from '../projects'
import { getProjectsStructuredData, projectMetadata, projectsUrl } from './projects'

const project: ProjectType = {
  title: 'Lift Club',
  themeColor: '#4361ee',
  slug: 'liftclub',
  summary: 'A workout log.',
  externalLink: 'https://www.liftclub.app/',
  desktopImgs: [{ src: '/img/hero.webp', width: 1200, height: 675 }],
  mobileImgs: [],
  date: 'Apr 2021',
  tags: [],
  meta: [],
  details: [],
}

describe('project search metadata', () => {
  it('distinguishes the portfolio page from the app and links its breadcrumb trail', () => {
    const { url, image, structured } = projectMetadata(project)
    expect(new URL(url).pathname).toBe('/work/liftclub')
    expect(new URL(image!).pathname).toBe('/img/hero.webp')
    expect(structured.mainEntity).toMatchObject({ '@type': 'WebApplication', url: project.externalLink })
    expect(structured.breadcrumb.itemListElement.map((x) => x.item)).toEqual([new URL('/', url).href, projectsUrl, url])
  })
  it('lists internal case studies even when projects have external destinations', () => {
    expect(getProjectsStructuredData([project]).mainEntity.itemListElement[0].url).toBe(projectMetadata(project).url)
  })
  it('omits an unavailable image and does not label unrelated projects as apps', () => {
    const meta = projectMetadata({ ...project, slug: 'example', externalLink: undefined, desktopImgs: [] })
    expect(meta.image).toBeUndefined()
    expect(meta.structured.mainEntity).toEqual({ '@type': 'CreativeWork', name: project.title, url: meta.url })
  })
})

// @vitest-environment jsdom
import { render, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import Projects, { getStaticProps } from '../../pages/projects'

const query = vi.hoisted((): { tag?: string } => ({}))
vi.mock('next/router', () => ({ useRouter: () => ({ query }) }))

it('keeps category URLs, selection, and visible projects in sync', () => {
  const { props } = getStaticProps()
  const view = render(<Projects {...props} />)
  const categories = within(view.getByRole('navigation', { name: 'Project categories' }))
  const visibleTitles = () => view.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
  expect(visibleTitles()).toEqual(props.projects.map(({ title }) => title))

  for (const [tag, label] of [
    ['commercial', 'Commercial'],
    ['personal', 'Personal'],
    ['open-source', 'Open source'],
  ] as const) {
    query.tag = tag
    view.rerender(<Projects {...props} />)
    const active = categories.getByRole('link', { current: 'page' })
    expect(active.textContent).toBe(label)
    expect(active.getAttribute('href')).toBe(`/projects?tag=${tag}`)
    expect(visibleTitles()).toEqual(props.projects.filter(({ tags }) => tags.includes(tag)).map(({ title }) => title))
  }

  query.tag = 'unknown'
  view.rerender(<Projects {...props} />)
  expect(categories.getByRole('link', { current: 'page' }).textContent).toBe('All')
  expect(visibleTitles()).toHaveLength(props.projects.length)
})

// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { expect, it } from 'vitest'

import { ProjectState } from '../../lib/projects'
import ProjectInstrument from './ProjectInstrument'

it('gives every catalog entry its own SVG drawing', () => {
  const { container } = render(
    <>
      {ProjectState.map(({ slug }) => (
        <ProjectInstrument key={slug} slug={slug} />
      ))}
    </>
  )
  const drawings = Array.from(container.querySelectorAll('svg'))
  expect(drawings.map((svg) => svg.dataset.instrument)).toEqual(ProjectState.map(({ slug }) => slug))
  expect(new Set(drawings.map((svg) => svg.innerHTML)).size).toBe(ProjectState.length)
})

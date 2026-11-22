import { readFileSync } from 'node:fs'
import { render } from '@testing-library/react'
import { expect, it } from 'vitest'

import Bio from './Bio'

it('signs off the bio without repeating its heading and supplies a still version of the same SVG', () => {
  const { container } = render(<Bio />)
  const picture = container.querySelector('section > p:last-of-type + picture')
  const img = picture?.querySelector('img')
  expect(img?.getAttribute('alt')).toBe('')
  expect(img?.getAttribute('src')).toBe('/signature.svg')

  const still = picture?.querySelector('source[media="(prefers-reduced-motion: reduce)"]')?.getAttribute('srcset')
  expect(still).toBe('/signature.svg#still')
  const asset = readFileSync('public/signature.svg', 'utf8')
  const svg = new DOMParser().parseFromString(asset, 'image/svg+xml')
  expect(svg.documentElement.id).toBe('still')
})

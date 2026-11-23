import { readFileSync } from 'node:fs'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import Bio from './Bio'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function openBio() {
  render(<Bio />)
  const heading = screen.getByRole('heading', { level: 1, name: 'Christian Anagnostou' })
  return { heading, name: within(heading).getByRole('button', { name: 'Christian Anagnostou' }) }
}

it('keeps the real name in the heading, with decorative ink from the traced SVG', () => {
  const { name } = openBio()
  expect(name.hasAttribute('data-ink')).toBe(false)
  const strokes = name.querySelectorAll('[aria-hidden="true"] use')
  const svg = new DOMParser().parseFromString(readFileSync('public/signature.svg', 'utf8'), 'image/svg+xml')
  expect(strokes.length).toBeGreaterThan(0)
  for (const stroke of strokes) {
    const [asset, id] = stroke.getAttribute('href')!.split('#')
    expect(asset).toBe('/signature.svg')
    expect(svg.getElementById(id)).not.toBeNull()
  }
})

it('reverses on pointer exit and returns to print after a tap', () => {
  vi.useFakeTimers()
  const { name } = openBio()
  fireEvent.pointerEnter(name, { pointerType: 'mouse' })
  expect(name.hasAttribute('data-ink')).toBe(true)
  fireEvent.pointerLeave(name, { pointerType: 'mouse' })
  expect(name.hasAttribute('data-ink')).toBe(false)
  fireEvent.click(name)
  expect(name.hasAttribute('data-ink')).toBe(true)
  act(() => vi.advanceTimersByTime(2100))
  expect(name.hasAttribute('data-ink')).toBe(false)
})

it('recognizes a sideways brush onto the name without capturing vertical scrolling', () => {
  const { heading, name } = openBio()
  vi.spyOn(name, 'getBoundingClientRect').mockReturnValue(new DOMRect(20, 20, 160, 24))
  const touch = { pointerType: 'touch', isPrimary: true, clientX: 190, clientY: 30 }
  fireEvent.pointerDown(heading, touch)
  fireEvent.pointerMove(heading, { ...touch, clientX: 175, clientY: 70 })
  fireEvent.pointerMove(heading, { ...touch, clientX: 140 })
  expect(name.hasAttribute('data-ink')).toBe(false)
  fireEvent.pointerDown(heading, touch)
  fireEvent.pointerMove(heading, { ...touch, clientX: 140 })
  expect(name.hasAttribute('data-ink')).toBe(true)
})

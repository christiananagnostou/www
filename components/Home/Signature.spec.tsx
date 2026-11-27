// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import Bio from './Bio'
import { LETTERFORMS } from './signature/letterforms'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function openBio() {
  render(<Bio />)
  const heading = screen.getByRole('heading', { level: 1, name: 'Christian Anagnostou' })
  return { heading, name: within(heading).getByRole('button', { name: 'Christian Anagnostou' }) }
}

const topology = (path: string) =>
  path
    .split('z')
    .filter(Boolean)
    .map((ring) => ring.match(/-?\d+/g)?.length)

it('keeps the real heading readable and requests decorative lettering only on interaction', async () => {
  const { name } = openBio()
  expect(name.hasAttribute('data-ink')).toBe(false)
  expect(name.querySelector('svg')).toBeNull()
  fireEvent.focus(name)
  await waitFor(() => expect(name.querySelectorAll('[aria-hidden="true"] rect')).toHaveLength(19))
  expect(screen.getByRole('heading', { name: 'Christian Anagnostou' })).toBeTruthy()
})

it('matches the contours and vertices of each printed letter to its signature counterpart', () => {
  for (const [print, ink] of LETTERFORMS) {
    expect(print).not.toBe(ink)
    expect(topology(print)).toEqual(topology(ink))
  }
})

it('reverses on pointer exit and returns to print after a tap', async () => {
  const { name } = openBio()
  fireEvent.pointerEnter(name, { pointerType: 'mouse' })
  await waitFor(() => expect(name.querySelector('svg')).not.toBeNull())
  expect(name.hasAttribute('data-ink')).toBe(true)
  fireEvent.pointerLeave(name, { pointerType: 'mouse' })
  expect(name.hasAttribute('data-ink')).toBe(false)
  vi.useFakeTimers()
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

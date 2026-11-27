import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import RecentArt from '../RecentArt'

function openTile() {
  let intersect: (entries: { target: Element; intersectionRatio: number }[]) => void
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof intersect) {
        intersect = callback
      }
      observe() {}
      disconnect() {}
    }
  )
  const { container } = render(<RecentArt />)
  const link = screen.getByRole('link', { name: 'Photos' })
  const rail = link.querySelector<HTMLElement>('[tabindex="-1"]')!
  Object.defineProperty(rail, 'clientWidth', { value: 300 })
  rail.scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    rail.scrollLeft = left ?? 0
  }) as typeof rail.scrollTo
  const stop = (index: number) => rail.querySelector(`[data-stop="${index}"]`)!
  const show = (position: number) => {
    rail.scrollLeft = position * rail.clientWidth
    fireEvent.scroll(rail)
    act(() =>
      intersect(
        Array.from({ length: 4 }, (_, index) => ({
          target: stop(index),
          intersectionRatio: Math.max(0, 1 - Math.abs(position - index)),
        }))
      )
    )
  }
  return { tile: link.parentElement!, link, rail, container, show }
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

it('keeps the original gallery link and only requests one print while idle', () => {
  vi.useFakeTimers()
  const { container, link, show } = openTile()
  show(0)
  act(() => vi.advanceTimersByTime(60_000))
  expect(container.querySelectorAll('img')).toHaveLength(1)
  expect(link.getAttribute('href')).toBe('/art')
  expect(screen.queryByRole('button', { name: /pause|play|resume/i })).toBeNull()
})

it('uses fractional scroll progress in the fallback and waits for the next photo to decode', async () => {
  vi.stubGlobal('CSS', { supports: () => false })
  const { tile, rail, show } = openTile()
  show(0.5)
  expect(tile.style.getPropertyValue('--print-position')).toBe('0.5')
  const second = rail.querySelector<HTMLElement>('[data-print="1"]')!
  expect(second.dataset.ready).toBe('false')
  expect(rail.querySelectorAll('img')).toHaveLength(2)
  await act(async () => fireEvent.load(second.querySelector('img')!))
  expect(second.dataset.ready).toBe('true')
  expect(rail.querySelectorAll('img')).toHaveLength(2)
  show(0.25)
  expect(tile.style.getPropertyValue('--print-position')).toBe('0.25')
  expect(screen.getByRole('status').textContent).toBe('B&W Baseball, 1 of 4')
})

it('uses native CSS when supported and lets keys and dots navigate from a partial position', () => {
  vi.stubGlobal('CSS', { supports: () => true })
  const { tile, rail, link, show } = openTile()
  show(1.4)
  expect(tile.style.getPropertyValue('--print-position')).toBe('')
  fireEvent.keyDown(link, { key: 'ArrowRight' })
  expect(rail.scrollLeft).toBe(600)
  show(1.4)
  fireEvent.keyDown(link, { key: 'ArrowLeft' })
  expect(rail.scrollLeft).toBe(300)
  fireEvent.click(screen.getByRole('button', { name: 'Show Satellite' }))
  expect(rail.scrollLeft).toBe(900)
  fireEvent.keyDown(link, { key: 'ArrowLeft', altKey: true })
  expect(rail.scrollLeft).toBe(900)
})

const pointer = (x: number, type = 'mouse') => ({
  pointerId: 1,
  pointerType: type,
  button: 0,
  clientX: x,
  clientY: 80,
})

it('only suspends snapping during an actual mouse drag and leaves taps and touch scrolling native', () => {
  const { rail, link } = openTile()
  fireEvent.pointerDown(rail, pointer(250))
  expect(rail.hasAttribute('data-dragging')).toBe(false)
  fireEvent.pointerMove(rail, pointer(100))
  expect(rail.hasAttribute('data-dragging')).toBe(true)
  expect(rail.scrollLeft).toBe(150)
  fireEvent.pointerUp(rail, pointer(100))
  expect(rail.hasAttribute('data-dragging')).toBe(false)
  expect(rail.scrollTo).toHaveBeenLastCalledWith({ left: 150 })
  expect(fireEvent.click(link, { detail: 1 })).toBe(false)
  vi.mocked(rail.scrollTo).mockClear()
  fireEvent.pointerDown(rail, pointer(100))
  fireEvent.pointerUp(rail, pointer(100))
  fireEvent.pointerDown(rail, pointer(100, 'touch'))
  fireEvent.pointerMove(rail, pointer(250, 'touch'))
  expect(rail.hasAttribute('data-dragging')).toBe(false)
  fireEvent.pointerUp(rail, pointer(250, 'touch'))
  expect(rail.scrollTo).not.toHaveBeenCalled()
})

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
  Object.defineProperties(rail, { clientWidth: { value: 300 }, scrollWidth: { value: 1200 } })
  rail.scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    rail.scrollLeft = Math.max(0, Math.min(900, left ?? 0))
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
  expect(screen.getByRole('status').textContent).toBe('Stair Shadow, 1 of 4')
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
  fireEvent.click(screen.getByRole('button', { name: 'Show B&W Baseball' }))
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

const finger = (x: number, y = 50) => ({ clientX: x, clientY: y })

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

it('counts only the distance past the last print, lets a pull unwind, and opens the gallery on release', () => {
  const { link, rail, show } = openTile()
  const icon = link.querySelector('svg')!
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  show(2.8)
  fireEvent.pointerDown(rail, pointer(240))
  fireEvent.pointerMove(rail, pointer(180))
  expect(rail.scrollLeft).toBe(900)
  expect(icon.dataset.pull).toBeUndefined()
  // An 82px pull used to commit; it should now be just under halfway.
  fireEvent.pointerMove(rail, pointer(98))
  expect(icon.dataset.pull).toBe('tracking')
  expect(Number(icon.style.getPropertyValue('--travel'))).toBeCloseTo(0.46, 1)
  fireEvent.pointerMove(rail, pointer(8))
  expect(icon.dataset.pull).toBe('ready')
  expect(open).not.toHaveBeenCalled()
  fireEvent.pointerMove(rail, pointer(160))
  fireEvent.pointerUp(rail, pointer(160))
  expect(icon.dataset.pull).toBeUndefined()
  expect(open).not.toHaveBeenCalled()

  fireEvent.pointerDown(rail, pointer(240))
  fireEvent.pointerMove(rail, pointer(62))
  fireEvent.pointerUp(rail, pointer(62))
  fireEvent.lostPointerCapture(rail, pointer(62))
  expect(open).toHaveBeenCalledTimes(1)
  expect(fireEvent.click(link, { detail: 1 })).toBe(false)
})

it('tracks native touch beyond the edge, but does not claim vertical pans, pinches, or canceled touches', () => {
  const { link, rail, show } = openTile()
  const icon = link.querySelector('svg')!
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  const begin = () => fireEvent.touchStart(rail, { touches: [finger(200)] })
  const move = (x: number, y = 50) => fireEvent.touchMove(rail, { touches: [finger(x, y)] })
  show(3)
  begin()
  expect(move(175, 100)).toBe(true)
  move(90)
  expect(icon.dataset.pull).toBeUndefined()
  fireEvent.touchEnd(rail)
  begin()
  move(20)
  fireEvent.touchStart(rail, { touches: [finger(100), finger(80)] })
  expect(icon.dataset.pull).toBeUndefined()
  fireEvent.touchEnd(rail)
  begin()
  move(20)
  fireEvent.touchCancel(rail)
  begin()
  move(20)
  fireEvent.touchEnd(rail, { changedTouches: [finger(170)] })
  expect(open).not.toHaveBeenCalled()

  vi.stubGlobal('innerWidth', 375)
  vi.stubGlobal('visualViewport', { width: 320 })
  begin()
  fireEvent.pointerCancel(rail, pointer(190, 'touch'))
  expect(move(105)).toBe(true)
  expect(icon.dataset.pull).toBe('tracking')
  move(50)
  expect(icon.dataset.pull).toBe('ready')
  fireEvent.touchEnd(rail)
  expect(open).toHaveBeenCalledTimes(1)
  expect(rail.scrollTo).not.toHaveBeenCalled()
})

it('ignores incoming wheel momentum and only commits a fresh outward burst once it ends', () => {
  vi.useFakeTimers()
  const { link, rail, show } = openTile()
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  const icon = link.querySelector('svg')!
  // Browser event timestamps share a monotonic clock, independent of the timer implementation in JSDOM.
  let time = 1000
  const scroll = (deltaX: number, deltaY = 0, keys: WheelEventInit = {}) => {
    const event = new window.WheelEvent('wheel', { bubbles: true, deltaX, deltaY, ...keys })
    Object.defineProperty(event, 'timeStamp', { value: (time += 12) })
    fireEvent(rail, event)
  }
  const rest = () => {
    time += 250
    act(() => vi.advanceTimersByTime(250))
  }
  show(2.8)
  scroll(500)
  show(3)
  for (let i = 0; i < 5; i++) scroll(50)
  rest()
  expect(icon.dataset.pull).toBeUndefined()
  scroll(900)
  expect(icon.dataset.pull).toBe('tracking')
  rest()
  scroll(40, 80)
  rest()
  scroll(60, 0, { ctrlKey: true })
  rest()
  for (let i = 0; i < 12; i++) scroll(150)
  expect(icon.dataset.pull).toBe('tracking')
  for (let i = 0; i < 14; i++) scroll(55)
  expect(icon.dataset.pull).toBe('ready')
  scroll(-15)
  rest()
  expect(open).not.toHaveBeenCalled()
  for (let i = 0; i < 7; i++) {
    time += 48
    scroll(0, 3, { shiftKey: true, deltaMode: 1 })
  }
  expect(icon.dataset.pull).toBe('ready')
  expect(open).not.toHaveBeenCalled()
  rest()
  expect(open).toHaveBeenCalledTimes(1)
})

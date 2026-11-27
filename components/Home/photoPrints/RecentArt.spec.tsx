// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import RecentArt from '../RecentArt'

function openTile() {
  const { container } = render(<RecentArt />)
  const link = screen.getByRole('link', { name: 'Photos' })
  const rail = link.querySelector<HTMLElement>('[tabindex="-1"]')!
  Object.defineProperties(rail, {
    clientWidth: { value: 300, configurable: true },
    scrollWidth: { value: 1020, configurable: true },
  })
  rail.scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    rail.scrollLeft = Math.max(0, Math.min(720, left ?? 0))
  }) as typeof rail.scrollTo
  const show = (position: number) => {
    rail.scrollLeft = position <= 2 ? position * 300 : 600 + (position - 2) * 120
    fireEvent.scroll(rail)
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
  const { tile, show } = openTile()
  show(0.5)
  expect(tile.style.getPropertyValue('--print-position')).toBe('0.5')
  const second = tile.querySelector<HTMLElement>('[data-print="1"]')!
  expect(second.dataset.ready).toBe('false')
  expect(tile.querySelectorAll('img')).toHaveLength(2)
  await act(async () => fireEvent.load(second.querySelector('img')!))
  expect(second.dataset.ready).toBe('true')
  expect(tile.querySelectorAll('img')).toHaveLength(2)
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
  expect(rail.scrollLeft).toBe(720)
  fireEvent.keyDown(link, { key: 'ArrowLeft', altKey: true })
  expect(rail.scrollLeft).toBe(720)
  show(2.6)
  expect(screen.getByRole('status').textContent).toBe('B&W Baseball, 4 of 4')
  fireEvent.keyDown(link, { key: 'ArrowLeft' })
  expect(rail.scrollLeft).toBe(600)
})

it('refreshes the cached scroll range after a resize, including the shorter final stride', () => {
  let resized: () => void
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resized = callback
      }
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal('CSS', { supports: () => false })
  const { tile, rail } = openTile()
  act(() => resized())
  Object.defineProperties(rail, { clientWidth: { value: 400 }, scrollWidth: { value: 1360 } })
  rail.scrollLeft = 880
  act(() => resized())
  expect(tile.style.getPropertyValue('--print-position')).toBe('2.5')
  rail.scrollLeft = 920
  fireEvent.scroll(rail)
  expect(tile.style.getPropertyValue('--print-position')).toBe('2.75')
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
  show(2.5)
  fireEvent.pointerDown(rail, pointer(240))
  fireEvent.pointerMove(rail, pointer(180))
  expect(rail.scrollLeft).toBe(720)
  expect(icon.dataset.pull).toBeUndefined()
  vi.mocked(rail.scrollTo).mockClear()
  // An 82px pull used to commit; it should now be just under halfway.
  fireEvent.pointerMove(rail, pointer(98))
  expect(icon.dataset.pull).toBe('tracking')
  expect(Number(icon.style.getPropertyValue('--travel'))).toBeCloseTo(0.46, 1)
  fireEvent.pointerMove(rail, pointer(8))
  expect(icon.dataset.pull).toBe('ready')
  expect(open).not.toHaveBeenCalled()
  expect(rail.scrollTo).not.toHaveBeenCalled()
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

it('hands a new outward swipe the last print before the native snap finishes', () => {
  const { link, rail, show } = openTile()
  const icon = link.querySelector('svg')!
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  const start = () => fireEvent.touchStart(rail, { touches: [finger(280)] })
  const move = (x: number) => fireEvent.touchMove(rail, { touches: [finger(x)] })
  const lift = (x: number) => fireEvent.touchEnd(rail, { changedTouches: [finger(x)] })

  show(2)
  start()
  show(2.65)
  move(60)
  lift(60)
  expect(icon.dataset.pull).toBeUndefined()
  expect(open).not.toHaveBeenCalled()

  // The browser still has some distance to snap. That belongs to the previous gesture.
  start()
  move(198)
  expect(Number(icon.style.getPropertyValue('--travel'))).toBeCloseTo(0.46, 1)
  lift(198)
  expect(open).not.toHaveBeenCalled()
  start()
  move(100)
  expect(icon.dataset.pull).toBe('ready')
  show(2.95)
  lift(100)
  expect(open).toHaveBeenCalledTimes(1)
  expect(rail.scrollTo).not.toHaveBeenCalled()
})

it('hands one held touch from Adobe through Baseball to the ring and only opens on release', () => {
  const { link, rail, show } = openTile()
  const icon = link.querySelector('svg')!
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  for (const reverse of [true, false]) {
    show(2)
    fireEvent.touchStart(rail, { touches: [finger(310)] })
    const move = (x: number) => fireEvent.touchMove(rail, { touches: [finger(x)] })
    move(190)
    expect(icon.dataset.pull).toBeUndefined()
    show(2.9)
    move(108)
    expect(Number(icon.style.getPropertyValue('--travel'))).toBeCloseTo(0.46, 1)
    show(3)
    move(18)
    expect(icon.dataset.pull).toBe('ready')
    expect(open).not.toHaveBeenCalled()
    if (reverse) move(125)
    fireEvent.touchEnd(rail, { changedTouches: [finger(reverse ? 125 : 18)] })
    expect(open).toHaveBeenCalledTimes(reverse ? 0 : 1)
  }
  expect(rail.scrollTo).not.toHaveBeenCalled()
})

it('accepts continuous trackpad pressure across the edge but not coasting, vertical scroll or a single notch', () => {
  vi.useFakeTimers()
  const { link, rail, show } = openTile()
  const open = vi.spyOn(link, 'click').mockImplementation(() => {})
  const icon = link.querySelector('svg')!
  // Browser event timestamps share a monotonic clock, independent of the timer implementation in JSDOM.
  let time = 1000
  const scroll = (deltaX: number, deltaY = 0, keys: WheelEventInit & { momentum?: boolean } = {}) => {
    const event = new window.WheelEvent('wheel', { bubbles: true, deltaX, deltaY, ...keys })
    Object.defineProperty(event, 'momentum', { value: keys.momentum })
    Object.defineProperty(event, 'timeStamp', { value: (time += 12) })
    fireEvent(rail, event)
  }
  const rest = () => {
    time += 250
    act(() => vi.advanceTimersByTime(250))
  }
  show(2)
  scroll(500)
  show(3)
  for (const decay of [70, 54, 42, 32, 22, 16, 11, 7, 4, 2, 1]) scroll(decay)
  rest()
  expect(icon.dataset.pull).toBeUndefined()
  expect(open).not.toHaveBeenCalled()
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
  show(2)
  scroll(60)
  show(3)
  for (let i = 0; i < 9; i++) {
    time += 48
    scroll(0, 3, { shiftKey: true, deltaMode: 1 })
  }
  scroll(18, 20)
  scroll(0, 2)
  scroll(-2)
  expect(icon.dataset.pull).toBe('ready')
  expect(open).not.toHaveBeenCalled()
  rest()
  expect(open).toHaveBeenCalledTimes(1)

  show(2)
  scroll(120, 0, { momentum: false })
  show(3)
  for (let i = 0; i < 30; i++) scroll(60, 0, { momentum: true })
  expect(icon.dataset.pull).toBeUndefined()
  // With a native momentum signal, direct input can continue across the edge without an idle gap.
  show(2)
  scroll(120, 0, { momentum: false })
  show(3)
  for (let i = 0; i < 30; i++) scroll(60, 0, { momentum: false })
  expect(icon.dataset.pull).toBe('ready')
  expect(open).toHaveBeenCalledTimes(1)
  scroll(20, 0, { momentum: true })
  rest()
  expect(open).toHaveBeenCalledTimes(2)
})

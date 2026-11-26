// @vitest-environment jsdom
import { afterEach, expect, it, onTestFinished, vi } from 'vitest'

import { mountGrove, scenePhase, type PaintScene } from './motion'

function scene(travel: number, reduced = false) {
  const layer = document.createElement('div')
  const canvas = document.createElement('canvas')
  const media = Object.assign(new EventTarget(), { matches: reduced })
  const paint = vi.fn<PaintScene>()
  const pending = new Map<number, FrameRequestCallback>()
  let id = 0
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    pending.set(++id, fn)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (key: number) => pending.delete(key))
  vi.stubGlobal('matchMedia', () => media)
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal('scrollY', 0)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800)
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(800 + travel)
  vi.spyOn(layer, 'clientHeight', 'get').mockReturnValue(800 + travel)
  vi.spyOn(canvas, 'clientHeight', 'get').mockReturnValue(800)
  vi.spyOn(canvas, 'clientWidth', 'get').mockReturnValue(350)
  vi.spyOn(canvas, 'getContext').mockReturnValue({ setTransform: vi.fn() } as unknown as CanvasRenderingContext2D)
  const stop = mountGrove(canvas, layer, paint)
  onTestFinished(stop)
  const tick = (ms: number) => {
    expect(pending.size).toBe(1)
    const [key, frame] = pending.entries().next().value!
    pending.delete(key)
    frame(ms)
  }
  return { paint, pending, tick, stop }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('holds the four poses, with continuous in-between states', () => {
  expect([-1, 0.4, 0.72, 2].map(scenePhase)).toEqual([0, 1, 2, 3])
  for (const [progress, pose] of [
    [0.2, 0],
    [0.55, 1],
    [0.85, 2],
  ]) {
    expect(scenePhase(progress)).toBeGreaterThan(pose)
    expect(scenePhase(progress)).toBeLessThan(pose + 1)
  }
})

it('scrubs in both directions, coalesces scroll events, and leaves no idle frame', () => {
  const { paint, pending, tick, stop } = scene(600)
  tick(0)
  for (const [y, pose] of [
    [600, 3],
    [240, 1],
    [0, 0],
  ]) {
    vi.stubGlobal('scrollY', y)
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    tick(16)
    expect(paint).toHaveBeenLastCalledWith(pose, 350, 800, 1400, y)
    expect(pending.size).toBe(0)
  }
  stop()
  window.dispatchEvent(new Event('scroll'))
  expect(pending.size).toBe(0)
})

it('plays only once on a fitting page and pauses the clock in hidden tabs', () => {
  const { paint, pending, tick } = scene(1)
  tick(0)
  tick(900)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
  document.dispatchEvent(new Event('visibilitychange'))
  expect(pending.size).toBe(0)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  document.dispatchEvent(new Event('visibilitychange'))
  tick(40_000)
  expect(paint.mock.lastCall?.[0]).toBeLessThan(1)
  tick(44_800)
  expect(paint.mock.lastCall?.[0]).toBe(3)
  expect(pending.size).toBe(0)
})

it.each([0, 600])('keeps the hybrid pose for reduced motion with %ipx of scroll', (travel) => {
  const { paint, pending, tick } = scene(travel, true)
  tick(0)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  expect(pending.size).toBe(0)
  vi.stubGlobal('scrollY', travel)
  window.dispatchEvent(new Event('scroll'))
  tick(9000)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  expect(pending.size).toBe(0)
})

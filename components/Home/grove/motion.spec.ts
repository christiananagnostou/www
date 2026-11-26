// @vitest-environment jsdom
import { afterEach, expect, it, onTestFinished, vi } from 'vitest'

import { mountGrove, scenePhase, type PaintScene, type Playback } from './motion'

function scene(travel: number, reduced = false) {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
  const canvas = document.createElement('canvas')
  const media = Object.assign(new EventTarget(), { matches: reduced })
  const paint = vi.fn<PaintScene>()
  const state = vi.fn<(s: Playback) => void>()
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
  vi.spyOn(canvas, 'clientHeight', 'get').mockReturnValue(800 + travel)
  vi.spyOn(canvas, 'clientWidth', 'get').mockReturnValue(350)
  vi.spyOn(canvas, 'getContext').mockReturnValue({ setTransform: vi.fn() } as unknown as CanvasRenderingContext2D)
  const controller = mountGrove(canvas, paint, state)
  onTestFinished(controller.destroy)
  const tick = (delta: number) => {
    vi.advanceTimersByTime(delta)
    expect(pending.size).toBe(1)
    const [key, frame] = pending.entries().next().value!
    pending.delete(key)
    frame(performance.now())
  }
  return { canvas, paint, state, pending, tick, media, ...controller }
}

afterEach(() => {
  vi.useRealTimers()
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

it('prints the entire document once; scrolling does not repaint or fast-forward the scene', () => {
  const { paint, pending, tick, destroy } = scene(600)
  tick(0)
  for (const y of [600, 240, 0]) {
    vi.stubGlobal('scrollY', y)
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
  }
  expect(paint).toHaveBeenCalledExactlyOnceWith(0, 350, 1400)
  expect(pending.size).toBe(0)
  destroy()
  window.dispatchEvent(new Event('scroll'))
  expect(pending.size).toBe(0)
  expect(vi.getTimerCount()).toBe(0)
})

it('bounds the backing store on a tall high-density display', () => {
  vi.stubGlobal('devicePixelRatio', 3)
  const { canvas, tick } = scene(15_000)
  tick(0)
  expect(canvas.width * canvas.height).toBeLessThanOrEqual(2_000_000)
  expect(canvas.height).toBeLessThanOrEqual(8192)
})

it.each([1, 600])('plays for 30 visible seconds with %ipx of scroll, then sleeps until replayed', (travel) => {
  const { paint, pending, tick, state, toggle } = scene(travel)
  tick(0)
  expect(state).toHaveBeenLastCalledWith('playing')
  tick(10_000)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  tick(11_000)
  expect(paint.mock.lastCall?.[0]).toBe(2)
  tick(8900)
  expect(paint.mock.lastCall?.[0]).toBeLessThan(3)
  tick(100)
  expect(paint.mock.lastCall?.[0]).toBe(3)
  expect(state).toHaveBeenLastCalledWith('finished')
  expect(vi.getTimerCount()).toBe(0)
  expect(pending.size).toBe(0)
  toggle()
  tick(0)
  expect(paint.mock.lastCall?.[0]).toBe(0)
  expect(state).toHaveBeenLastCalledWith('playing')
})

it('does not count time in background tabs, while paused, or under reduced motion', () => {
  const { paint, pending, tick, media, state, toggle } = scene(1)
  tick(0)
  tick(3000)
  const before = paint.mock.lastCall?.[0]
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
  document.dispatchEvent(new Event('visibilitychange'))
  vi.advanceTimersByTime(60_000)
  expect(pending.size).toBe(0)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  document.dispatchEvent(new Event('visibilitychange'))
  tick(0)
  expect(paint.mock.lastCall?.[0]).toBe(before)
  toggle()
  tick(0)
  expect(state).toHaveBeenLastCalledWith('paused')
  expect(vi.getTimerCount()).toBe(0)
  vi.advanceTimersByTime(40_000)
  media.matches = true
  media.dispatchEvent(new Event('change'))
  tick(0)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  expect(state).toHaveBeenLastCalledWith('still')
  media.matches = false
  media.dispatchEvent(new Event('change'))
  tick(0)
  expect(state).toHaveBeenLastCalledWith('paused')
  expect(paint.mock.lastCall?.[0]).toBe(before)
  toggle()
  tick(0)
  tick(27_000)
  expect(paint.mock.lastCall?.[0]).toBe(3)
  expect(pending.size).toBe(0)
})

it.each([0, 600])('keeps the hybrid pose for reduced motion with %ipx of scroll', (travel) => {
  const { paint, pending, tick, state } = scene(travel, true)
  tick(0)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  expect(pending.size).toBe(0)
  expect(state).toHaveBeenLastCalledWith('still')
  expect(vi.getTimerCount()).toBe(0)
  vi.stubGlobal('scrollY', travel)
  window.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(9000)
  expect(paint.mock.lastCall?.[0]).toBe(1)
  expect(pending.size).toBe(0)
})

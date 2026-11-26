const PASS_MS = 30_000
const FRAME_MS = 1000 / 30
// Leave time for the eye to recognize each silhouette, especially the stone-to-bark pose.
const MORPHS = [
  [0.025, 0.32],
  [0.41, 0.67],
  [0.72, 1],
] as const

export function scenePhase(progress: number) {
  for (const [index, [start, end]] of MORPHS.entries()) {
    if (progress <= start) return index
    if (progress < end) {
      const t = (progress - start) / (end - start)
      return index + t * t * (3 - 2 * t)
    }
  }
  return MORPHS.length
}

export type Playback = 'playing' | 'paused' | 'finished' | 'still'
export type PaintScene = (phase: number, width: number, height: number) => void

export function mountGrove(canvas: HTMLCanvasElement, paint: PaintScene, notify: (s: Playback) => void) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let width = 0,
    height = 0
  let dirty = true,
    frame = 0,
    timer = 0,
    lastPhase = -1
  let elapsed = 0,
    paused = false,
    since: number | undefined

  const status = () => (reduced.matches ? 'still' : elapsed === PASS_MS ? 'finished' : paused ? 'paused' : 'playing')
  const timeAt = (now: number) => Math.min(PASS_MS, elapsed + (since === undefined ? 0 : Math.max(0, now - since)))

  function draw(now: number) {
    frame = 0
    if (document.hidden) return
    if (dirty) {
      width = canvas.clientWidth
      height = canvas.clientHeight
      // One canvas for the whole page. Bound its backing store, including long pages at high zoom.
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2,
        8192 / Math.max(1, width, height),
        Math.sqrt(2_000_000 / Math.max(1, width * height))
      )
      canvas.width = Math.max(1, Math.floor(width * ratio))
      canvas.height = Math.max(1, Math.floor(height * ratio))
      canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
      lastPhase = -1
      dirty = false
    }
    if (!width || !height) return
    if (status() === 'playing') since ??= now
    const time = timeAt(now)
    if (time === PASS_MS && elapsed !== PASS_MS) {
      elapsed = time
      since = undefined
      notify(status())
    }
    const phase = reduced.matches ? 1 : scenePhase(time / PASS_MS)
    if (phase !== lastPhase) {
      paint(phase, width, height)
      lastPhase = phase
    }
    if (since !== undefined && !timer) {
      const next = MORPHS.find(([, end]) => time < end * PASS_MS)
      // Sleep through held poses instead of redrawing a still image at display refresh rate.
      const delay = Math.max(FRAME_MS, (next?.[0] ?? 1) * PASS_MS - time)
      timer = window.setTimeout(() => {
        timer = 0
        schedule()
      }, delay)
    }
  }
  function schedule() {
    if (!frame && !document.hidden) frame = window.requestAnimationFrame(draw)
  }
  function resize() {
    dirty = true
    schedule()
  }
  function park() {
    elapsed = timeAt(performance.now())
    since = undefined
    window.cancelAnimationFrame(frame)
    window.clearTimeout(timer)
    frame = timer = 0
  }
  function sync() {
    park()
    notify(status())
    schedule()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', sync)
  reduced.addEventListener('change', sync)
  notify(status())
  schedule()
  return {
    toggle() {
      if (reduced.matches) return
      park()
      if (elapsed === PASS_MS) {
        elapsed = 0
        paused = false
      } else paused = !paused
      notify(status())
      schedule()
    },
    destroy() {
      park()
      observer.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
    },
  }
}

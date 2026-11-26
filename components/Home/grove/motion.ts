const clamp = (n: number) => Math.min(1, Math.max(0, n))
const PASS_MS = 4800

// Each interval is a morph; its surrounding space is a hold. Give the hybrid
// column-and-root silhouette the longest pause before the ride begins.
export function scenePhase(progress: number) {
  const ease = (start: number, end: number) => {
    const t = clamp((progress - start) / (end - start))
    return t * t * (3 - 2 * t)
  }
  return ease(0.07, 0.34) + ease(0.48, 0.69) + ease(0.74, 1)
}

export type PaintScene = (phase: number, width: number, height: number, pageHeight: number, offset: number) => void

export function mountGrove(canvas: HTMLCanvasElement, layer: HTMLElement, paint: PaintScene) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let width = 0,
    height = 0,
    pageHeight = 0,
    pageTop = 0,
    travel = 0
  let dirty = true,
    pending = 0,
    elapsed = 0,
    lastTime: number | undefined
  let lastPhase = -1,
    lastOffset = -1

  function draw(now: number) {
    pending = 0
    if (document.hidden) return
    if (dirty) {
      width = canvas.clientWidth
      height = canvas.clientHeight
      pageHeight = layer.clientHeight
      pageTop = layer.getBoundingClientRect().top + window.scrollY
      travel = Math.max(0, document.documentElement.scrollHeight - document.documentElement.clientHeight)
      const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2_000_000 / Math.max(1, width * height)))
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
      lastPhase = -1
      dirty = false
    }
    if (!width || !height) return
    // The sticky nav's one-pixel border can produce a phantom scroll range.
    const automatic = !reduced.matches && travel <= 2
    if (automatic && lastTime !== undefined) elapsed = Math.min(PASS_MS, elapsed + now - lastTime)
    lastTime = automatic && elapsed < PASS_MS ? now : undefined
    const phase = reduced.matches
      ? 1
      : scenePhase(automatic ? elapsed / PASS_MS : clamp(window.scrollY / Math.max(1, travel)))
    const offset = Math.max(0, Math.min(window.scrollY - pageTop, pageHeight - height))
    if (phase !== lastPhase || offset !== lastOffset) {
      paint(phase, width, height, pageHeight, offset)
      lastPhase = phase
      lastOffset = offset
    }
    if (automatic && elapsed < PASS_MS) schedule()
  }
  function schedule() {
    if (!pending && !document.hidden) pending = window.requestAnimationFrame(draw)
  }
  function resize() {
    dirty = true
    schedule()
  }
  function visibility() {
    window.cancelAnimationFrame(pending)
    pending = 0
    lastTime = undefined
    schedule()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(layer)
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', schedule, { passive: true })
  document.addEventListener('visibilitychange', visibility)
  reduced.addEventListener('change', visibility)
  schedule()
  return () => {
    window.cancelAnimationFrame(pending)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', schedule)
    document.removeEventListener('visibilitychange', visibility)
    reduced.removeEventListener('change', visibility)
  }
}

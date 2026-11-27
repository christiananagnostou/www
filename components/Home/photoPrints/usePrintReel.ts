import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

// Touch, trackpads, momentum and vertical page scrolling are all native.
// Only a mouse needs a hand translating a drag into horizontal scrolling.
export function usePrintReel(count: number) {
  const tile = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: number; x: number; y: number; left: number } | null>(null)
  const dragged = useRef(false)
  const [current, setCurrent] = useState(0)
  const [requested, setRequested] = useState<number[]>([0])

  function request(index: number) {
    setRequested((old) => (old.includes(index) ? old : [...old, index]))
  }

  useEffect(() => {
    const node = rail.current!
    function progress() {
      return Math.max(0, Math.min(count - 1, node.scrollLeft / (node.clientWidth || 1)))
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.stop)
          if (entry.intersectionRatio > 0) request(index)
          if (entry.intersectionRatio >= 0.5) setCurrent(index)
        }
      },
      { root: node, threshold: [0.001, 0.5, 0.999] }
    )
    node.querySelectorAll('[data-stop]').forEach((stop) => observer.observe(stop))

    // Older engines use the same CSS reveal, with one local style write and no React renders per frame.
    const nativeTimeline = window.CSS?.supports(
      '(timeline-scope: --prints) and (animation-timeline: --prints) and (animation-range: 0% 50%)'
    )
    function sync() {
      tile.current?.style.setProperty('--print-position', String(progress()))
    }
    const resize = !nativeTimeline && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    if (!nativeTimeline) {
      sync()
      node.addEventListener('scroll', sync, { passive: true })
      resize?.observe(node)
    }
    return () => {
      observer.disconnect()
      resize?.disconnect()
      if (!nativeTimeline) node.removeEventListener('scroll', sync)
    }
  }, [count])

  function go(index: number) {
    const node = rail.current
    if (!node || index < 0 || index >= count) return
    request(index)
    node.scrollTo({ left: index * node.clientWidth, behavior: 'auto' })
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerId !== drag.current?.id) return
    drag.current = null
    if (!dragged.current) return
    const node = event.currentTarget
    node.removeAttribute('data-dragging')
    // Give CSS the final offset even if this drag interrupted an earlier Firefox snap.
    node.scrollTo({ left: node.scrollLeft })
  }

  return {
    tile,
    current,
    requested,
    go,
    step(direction: -1 | 1) {
      const node = rail.current!
      const position = Math.round((node.scrollLeft / (node.clientWidth || 1)) * 100) / 100
      go(direction === 1 ? Math.floor(position) + 1 : Math.ceil(position) - 1)
    },
    onClick(event: MouseEvent<HTMLAnchorElement>) {
      if (dragged.current && event.detail !== 0) event.preventDefault()
      dragged.current = false
    },
    railProps: {
      ref: rail,
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        dragged.current = false
        if (
          event.pointerType !== 'mouse' ||
          event.button !== 0 ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        )
          return
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft }
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        const start = drag.current
        if (!start || start.id !== event.pointerId) return
        const dx = event.clientX - start.x
        if (!dragged.current) {
          if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(event.clientY - start.y)) return
          event.currentTarget.setPointerCapture?.(event.pointerId)
          event.currentTarget.setAttribute('data-dragging', '')
          dragged.current = true
        }
        event.currentTarget.scrollTo({ left: start.left - dx, behavior: 'instant' })
      },
      onPointerLeave() {
        if (!dragged.current) drag.current = null
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
    },
  }
}

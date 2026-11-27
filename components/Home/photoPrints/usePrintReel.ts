import { useEffect, useRef, useState } from 'react'

import { usePrintGestures } from './usePrintGestures'

export function usePrintReel(count: number) {
  const tile = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const { gallery, indicator, cancel, handlers, onClick } = usePrintGestures(rail)
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
    cancel()
    request(index)
    node.scrollTo({ left: index * node.clientWidth, behavior: 'auto' })
  }

  return {
    tile,
    gallery,
    indicator,
    onClick,
    railProps: { ref: rail, ...handlers },
    current,
    requested,
    go,
    step(direction: -1 | 1) {
      const node = rail.current!
      const position = Math.round((node.scrollLeft / (node.clientWidth || 1)) * 100) / 100
      go(direction === 1 ? Math.floor(position) + 1 : Math.ceil(position) - 1)
    },
  }
}

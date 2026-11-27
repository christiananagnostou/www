import { useCallback, useEffect, useRef, useState } from 'react'

import { measureRail, printPosition } from './printPosition'
import { usePrintGestures } from './usePrintGestures'

export function usePrintReel(count: number) {
  const tile = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const { gallery, indicator, cancel, handlers, onClick } = usePrintGestures(rail, count)
  const [current, setCurrent] = useState(0)
  const [requested, setRequested] = useState<number[]>([0])
  const mounted = useRef(requested)

  const request = useCallback((index: number) => {
    if (mounted.current.includes(index)) return
    mounted.current = [...mounted.current, index]
    setRequested(mounted.current)
  }, [])

  useEffect(() => {
    const node = rail.current!
    const nativeTimeline = window.CSS?.supports(
      '(timeline-scope: --prints) and (animation-timeline: --prints) and (animation-range: 0% 50%)'
    )
    let bounds: ReturnType<typeof measureRail> | undefined
    let selected = 0
    function sync() {
      const position = printPosition(node.scrollLeft, count, bounds ?? measureRail(node))
      if (!nativeTimeline) tile.current?.style.setProperty('--print-position', String(position))
      // Ignore subpixel rounding at a snap: an idle photo mustn't fetch its neighbor.
      request(Math.floor(position + 0.005))
      request(Math.ceil(position - 0.005))
      const nearest = Math.round(position)
      if (nearest !== selected) {
        selected = nearest
        setCurrent(nearest)
      }
    }
    sync()
    const resize =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            bounds = measureRail(node)
            sync()
          })
        : null
    resize?.observe(node)
    node.addEventListener('scroll', sync, { passive: true })
    return () => {
      resize?.disconnect()
      node.removeEventListener('scroll', sync)
    }
  }, [count, request])

  function go(index: number) {
    const node = rail.current
    if (!node || index < 0 || index >= count) return
    cancel()
    request(index)
    const { width, end } = measureRail(node)
    node.scrollTo({ left: Math.min(index * width, end), behavior: 'auto' })
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
      const position = Math.round(printPosition(node.scrollLeft, count, measureRail(node)) * 100) / 100
      go(direction === 1 ? Math.floor(position) + 1 : Math.ceil(position) - 1)
    },
  }
}

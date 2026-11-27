import { useEffect, useRef, useState } from 'react'

import { printPosition } from './printPosition'
import { usePrintGestures } from './usePrintGestures'

export function usePrintReel(count: number) {
  const tile = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const { gallery, indicator, cancel, handlers, onClick } = usePrintGestures(rail, count)
  const [current, setCurrent] = useState(0)
  const [requested, setRequested] = useState<number[]>([0])

  function request(index: number) {
    setRequested((old) => (old.includes(index) ? old : [...old, index]))
  }

  useEffect(() => {
    const node = rail.current!
    const nativeTimeline = window.CSS?.supports(
      '(timeline-scope: --prints) and (animation-timeline: --prints) and (animation-range: 0% 50%)'
    )
    let first = -1
    let last = -1
    let selected = -1
    function sync() {
      const position = printPosition(node, count)
      if (!nativeTimeline) tile.current?.style.setProperty('--print-position', String(position))
      // CSS handles the frames; React only changes when another print enters or becomes nearest.
      const from = Math.floor(position + 0.005)
      const to = Math.ceil(position - 0.005)
      if (from !== first || to !== last) {
        if (from !== first) request(from)
        if (to !== last && to !== from) request(to)
        first = from
        last = to
      }
      const nearest = Math.round(position)
      if (nearest !== selected) {
        selected = nearest
        setCurrent(nearest)
      }
    }
    sync()
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null
    resize?.observe(node)
    node.addEventListener('scroll', sync, { passive: true })
    return () => {
      resize?.disconnect()
      node.removeEventListener('scroll', sync)
    }
  }, [count])

  function go(index: number) {
    const node = rail.current
    if (!node || index < 0 || index >= count) return
    cancel()
    request(index)
    node.scrollTo({ left: Math.min(index * node.clientWidth, node.scrollWidth - node.clientWidth), behavior: 'auto' })
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
      const position = Math.round(printPosition(node, count) * 100) / 100
      go(direction === 1 ? Math.floor(position) + 1 : Math.ceil(position) - 1)
    },
  }
}

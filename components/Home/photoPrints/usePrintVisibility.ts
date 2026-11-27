import { useEffect, useRef, useState } from 'react'

/** Leave the server-rendered print alone until motion is wanted and the tile is on screen. */
export function usePrintVisibility() {
  const tile = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!tile.current || !window.matchMedia || typeof IntersectionObserver === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let inView = false
    const sync = () => setVisible(inView && !document.hidden && !reduced.matches)
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.25
        sync()
      },
      { threshold: 0.25 }
    )
    observer.observe(tile.current)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  return [tile, visible] as const
}

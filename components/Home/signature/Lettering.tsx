import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

import { LETTERFORMS, NAME_ADVANCE } from './letterforms'

import styles from './Lettering.module.css'

const glyphs = LETTERFORMS.map(([print, hand], index) => (
  <g
    key={index}
    style={
      {
        '--type': `path(evenodd, "${print}")`,
        '--hand': `path(evenodd, "${hand}")`,
        '--lag': `${index * 12}ms`,
        '--lift': `${Math.round(-22 - 10 * Math.sin(index * 0.75))}px`,
      } as CSSProperties
    }
  >
    <rect fill="currentColor" height="540" width={NAME_ADVANCE} />
  </g>
))

export default function Lettering() {
  const layer = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    const root = layer.current
    const first = root?.querySelector('rect')
    if (!root || !first) return
    // Establish the printed contours before starting even the very first, on-demand hover.
    getComputedStyle(first).getPropertyValue('clip-path')
    root.setAttribute('data-ready', '')
  }, [])

  return (
    <svg className={styles.layer} aria-hidden="true" focusable="false" ref={layer} viewBox={`0 0 ${NAME_ADVANCE} 540`}>
      {glyphs}
    </svg>
  )
}

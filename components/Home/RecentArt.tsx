import * as m from 'framer-motion/m'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { fade, photoAnim, staggerFade } from '../animation'
import { PrintSheet, prints } from './photoPrints/Print'
import { usePrintReel } from './photoPrints/usePrintReel'

import styles from './photoPrints/Prints.module.css'

export default function RecentArt() {
  const { tile, gallery, indicator, current, requested, go, step, railProps, onClick } = usePrintReel(prints.length)
  return (
    <m.div
      ref={tile}
      className={styles.tile}
      style={{ '--print-count': prints.length } as CSSProperties}
      variants={staggerFade}
    >
      <Link
        ref={gallery}
        aria-description="Swipe or use the arrow keys to change the photograph. Open this link to see all photography."
        aria-keyshortcuts="ArrowLeft ArrowRight"
        className={styles.gallery}
        draggable={false}
        href="/art"
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
          event.preventDefault()
          step(event.key === 'ArrowRight' ? 1 : -1)
        }}
      >
        <m.div className={styles.exposure} variants={photoAnim} aria-hidden="true">
          {prints.map(
            (print, index) => requested.includes(index) && <PrintSheet key={print.title} print={print} index={index} />
          )}
        </m.div>
        <div {...railProps} className={styles.rail} aria-hidden="true" tabIndex={-1}>
          {prints.map((print, index) => (
            <i data-stop={index} key={print.title} />
          ))}
        </div>
        <m.h2 variants={fade}>Photos</m.h2>
        <svg ref={indicator} className={styles.pull} aria-hidden="true" focusable="false" viewBox="0 0 36 36">
          <circle className={styles.rim} cx="18" cy="18" r="16" />
          <circle className={styles.sweep} cx="18" cy="18" r="16" pathLength="1" />
          <path d="M11.5 18h13m-5-5 5 5-5 5" />
        </svg>
      </Link>
      <div className={styles.positions} role="group" aria-label="Choose a photograph">
        {prints.map((print, index) => (
          <button
            aria-current={index === current ? 'true' : undefined}
            aria-label={`Show ${print.title}`}
            key={print.title}
            onClick={() => go(index)}
            style={{ '--index': index } as CSSProperties}
            type="button"
          />
        ))}
      </div>
      <span className={styles.announcement} role="status">
        {prints[current].title}, {current + 1} of {prints.length}
      </span>
    </m.div>
  )
}

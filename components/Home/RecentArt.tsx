import * as m from 'framer-motion/m'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

import { fade, photoAnim, staggerFade } from '../animation'

import { PrintSheet, prints } from './photoPrints/Print'
import styles from './photoPrints/Prints.module.css'
import { usePrintReel } from './photoPrints/usePrintReel'
import { HomepageBox } from './styles'

export default function RecentArt() {
  const { tile, current, requested, go, step, railProps, onClick } = usePrintReel(prints.length)
  return (
    <Tile
      ref={tile}
      className={styles.tile}
      style={{ '--print-count': prints.length } as CSSProperties}
      variants={staggerFade}
    >
      <Link
        aria-description="Swipe or use the arrow keys to change the photograph."
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
        <div {...railProps} className={styles.rail} aria-hidden="true" tabIndex={-1}>
          <div className={styles.track}>
            {prints.map((print, index) => (
              <i data-stop={index} key={print.title} style={{ gridColumn: index + 1 }} />
            ))}
            <div className={styles.pinned}>
              <m.div className={styles.exposure} variants={photoAnim}>
                {prints.map(
                  (print, index) =>
                    requested.includes(index) && <PrintSheet key={print.title} print={print} index={index} />
                )}
              </m.div>
            </div>
          </div>
        </div>
        <m.h2 variants={fade}>Photos</m.h2>
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
    </Tile>
  )
}

const Tile = styled(HomepageBox)`
  display: grid;
  padding: 0;
`

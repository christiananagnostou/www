import * as m from 'framer-motion/m'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { fade, photoAnim, staggerFade } from '../animation'

import { Print, prints } from './photoPrints/Print'
import styles from './photoPrints/Prints.module.css'
import { usePrintVisibility } from './photoPrints/usePrintVisibility'
import { HomepageBox } from './styles'

type Stage = 'still' | 'loading' | 'printing' | 'unavailable'

export default function RecentArt() {
  const [tile, visible] = usePrintVisibility()
  const [current, setCurrent] = useState(0)
  const [stage, setStage] = useState<Stage>('still')
  const [paused, setPaused] = useState(false)
  const next = (current + 1) % prints.length
  const playing = visible && !paused

  useEffect(() => {
    if (!playing || stage !== 'still') return
    const timer = window.setTimeout(() => setStage('loading'), 8000)
    return () => window.clearTimeout(timer)
  }, [playing, stage])

  return (
    <Tile ref={tile} variants={staggerFade}>
      <Link className={styles.gallery} href="/art">
        <m.div aria-hidden="true" className={styles.exposure} data-playing={playing} variants={photoAnim}>
          {prints.map((print, index) => {
            const arriving = index === next && (stage === 'loading' || stage === 'printing')
            if (index !== current && !arriving) return null

            return (
              <div
                className={styles.sheet}
                data-stage={arriving ? stage : undefined}
                key={index}
                onAnimationEnd={(event) => {
                  if (!arriving || event.target !== event.currentTarget) return
                  setCurrent(index)
                  setStage('still')
                }}
              >
                <Print
                  print={print}
                  onError={arriving ? () => setStage('unavailable') : undefined}
                  onLoad={arriving ? () => setStage('printing') : undefined}
                />
                {arriving && stage === 'printing' && (
                  <div className={styles.screen}>
                    <Print print={print} />
                  </div>
                )}
              </div>
            )
          })}
        </m.div>
        <m.h2 variants={fade}>Photos</m.h2>
      </Link>
      {visible && stage !== 'unavailable' && (
        <button
          aria-label={paused ? 'Resume photo rotation' : 'Pause photo rotation'}
          className={styles.playback}
          onClick={() => setPaused(!paused)}
          type="button"
        >
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
            <path d={paused ? 'M5 3 13 8 5 13Z' : 'M4 3h2.5v10H4zM9.5 3H12v10H9.5z'} />
          </svg>
        </button>
      )}
    </Tile>
  )
}

const Tile = styled(HomepageBox)`
  display: grid;
  padding: 0;
`

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'

import Adobe from '../../../public/img/art/photography/adobe_bnw.jpg'
import Baseball from '../../../public/img/art/photography/bnw_baseball.jpg'
import Satellite from '../../../public/img/art/photography/satellite.jpg'
import StairShadow from '../../../public/img/art/photography/stair_shadow.jpg'

import styles from './Prints.module.css'
import adobeStrip from './strips/adobe_bnw.avif'
import baseballStrip from './strips/bnw_baseball.avif'
import satelliteStrip from './strips/satellite.avif'
import stairsStrip from './strips/stair_shadow.avif'

export const prints = [
  { title: 'B&W Baseball', image: Baseball, strip: baseballStrip, position: '50% 56%', treatment: styles.mountedStrip },
  { title: 'Adobe B&W', image: Adobe, strip: adobeStrip, position: '50% 84%' },
  { title: 'Stair Shadow', image: StairShadow, strip: stairsStrip, position: 'center', treatment: styles.monochrome },
  { title: 'Satellite', image: Satellite, strip: satelliteStrip, position: '50% 93%', treatment: styles.mountedStrip },
]

type Photo = (typeof prints)[number]

function Print({ print, onLoad }: { print: Photo; onLoad?: () => void }) {
  return (
    <picture className={print.treatment}>
      <source media="(max-width: 768px)" srcSet={print.strip.src} type="image/avif" />
      <Image alt="" fill onLoad={onLoad} sizes="215px" src={print.image} style={{ objectPosition: print.position }} />
    </picture>
  )
}

export function PrintSheet({ print, index }: { print: Photo; index: number }) {
  const [ready, setReady] = useState(index === 0)
  return (
    <div className={styles.sheet} data-print={index} data-ready={ready} style={{ '--index': index } as CSSProperties}>
      <Print print={print} onLoad={index ? () => setReady(true) : undefined} />
      {index > 0 && ready && (
        <div className={styles.screen}>
          <Print print={print} />
        </div>
      )}
    </div>
  )
}

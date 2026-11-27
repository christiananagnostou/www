import Image from 'next/image'

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
  { image: Baseball, strip: baseballStrip, position: '50% 56%', treatment: styles.mountedStrip },
  { image: Adobe, strip: adobeStrip, position: '50% 84%' },
  { image: StairShadow, strip: stairsStrip, position: 'center', treatment: styles.monochrome },
  { image: Satellite, strip: satelliteStrip, position: '50% 93%', treatment: styles.mountedStrip },
]

type Props = { print: (typeof prints)[number]; onLoad?: () => void; onError?: () => void }

export function Print({ print, onLoad, onError }: Props) {
  return (
    <picture className={print.treatment}>
      <source media="(max-width: 768px)" srcSet={print.strip.src} type="image/avif" />
      <Image
        alt=""
        fill
        onError={onError}
        onLoad={onLoad}
        sizes="215px"
        src={print.image}
        style={{ objectPosition: print.position }}
      />
    </picture>
  )
}

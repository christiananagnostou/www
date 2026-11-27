import Image from 'next/image'

import Adobe from '../../../public/img/art/photography/adobe_bnw.jpg'
import ArrowUp from '../../../public/img/art/photography/arrow_up.jpg'
import Satellite from '../../../public/img/art/photography/satellite.jpg'
import StairShadow from '../../../public/img/art/photography/stair_shadow.jpg'

import styles from './Prints.module.css'
import adobeStrip from './strips/adobe_bnw.avif'
import arrowStrip from './strips/arrow_up.avif'
import satelliteStrip from './strips/satellite.avif'
import stairsStrip from './strips/stair_shadow.avif'

export const prints = [
  { image: ArrowUp, strip: arrowStrip, position: '50% 56%' },
  { image: Adobe, strip: adobeStrip, position: '50% 84%' },
  { image: StairShadow, strip: stairsStrip, position: 'center', treatment: styles.monochrome },
  { image: Satellite, strip: satelliteStrip, position: '50% 93%', treatment: styles.satellite },
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

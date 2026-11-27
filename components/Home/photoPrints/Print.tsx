import Image from 'next/image'

import FieldWalker from '../../../public/img/art/photography/dad_soccer.jpg'
import GoldenGate from '../../../public/img/art/photography/golden_gate.jpg'
import Levels from '../../../public/img/art/photography/levels.jpg'

import fieldStrip from './strips/dad_soccer.avif'
import bridgeStrip from './strips/golden_gate.avif'
import levelsStrip from './strips/levels.avif'

export const prints = [
  { image: GoldenGate, strip: bridgeStrip, position: '50% 53%' },
  { image: Levels, strip: levelsStrip, position: '50% 46%' },
  { image: FieldWalker, strip: fieldStrip, position: '50% 49%' },
]

type Props = { print: (typeof prints)[number]; onLoad?: () => void; onError?: () => void }

export function Print({ print, onLoad, onError }: Props) {
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={print.strip.src} type="image/avif" />
      <Image
        alt=""
        fill
        loading="eager"
        onError={onError}
        onLoad={onLoad}
        sizes="215px"
        src={print.image}
        style={{ objectPosition: print.position }}
      />
    </picture>
  )
}

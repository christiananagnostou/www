import Image from 'next/image'
import { memo, useState, type CSSProperties } from 'react'

import styles from './Prints.module.css'

// These fills need the hashed URLs, not the dimensions or blur placeholders of a static image import.
export const prints = [
  {
    title: 'Stair Shadow',
    image: new URL('../../../public/img/art/photography/stair_shadow.jpg', import.meta.url).pathname,
    strip: new URL('./strips/stair_shadow.avif', import.meta.url).pathname,
    position: 'center',
    treatment: styles.monochrome,
  },
  {
    title: 'Satellite',
    image: new URL('../../../public/img/art/photography/satellite.jpg', import.meta.url).pathname,
    strip: new URL('./strips/satellite.avif', import.meta.url).pathname,
    position: '50% 93%',
    treatment: styles.mountedStrip,
  },
  {
    title: 'Adobe B&W',
    image: new URL('../../../public/img/art/photography/adobe_bnw.jpg', import.meta.url).pathname,
    strip: new URL('./strips/adobe_bnw.avif', import.meta.url).pathname,
    position: '50% 84%',
  },
  {
    title: 'B&W Baseball',
    image: new URL('../../../public/img/art/photography/bnw_baseball.jpg', import.meta.url).pathname,
    strip: new URL('./strips/bnw_baseball.avif', import.meta.url).pathname,
    position: '50% 56%',
    treatment: styles.mountedStrip,
  },
]

type Photo = (typeof prints)[number]

export const PrintSheet = memo(function PrintSheet({ print, index }: { print: Photo; index: number }) {
  const [ready, setReady] = useState(index === 0)
  return (
    <div className={styles.sheet} data-print={index} data-ready={ready} style={{ '--index': index } as CSSProperties}>
      <picture className={print.treatment}>
        <source media="(max-width: 768px)" srcSet={print.strip} type="image/avif" />
        <Image
          alt=""
          fill
          onLoad={index ? () => setReady(true) : undefined}
          sizes="215px"
          src={print.image}
          style={{ objectPosition: print.position }}
        />
      </picture>
    </div>
  )
})

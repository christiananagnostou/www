import * as m from 'framer-motion/m'

import { fade, staggerFade } from '../animation'
import Giants from '../SVG/Giants'
import Signature from './Signature'

import styles from './Bio.module.css'

function Bio() {
  return (
    <m.section className={`${styles.description} max-w-screen`} variants={staggerFade}>
      <Signature />

      <m.p variants={fade}>
        Creating web experiences that <em>inspire</em>. Currently working as a lead software engineer at{' '}
        <a aria-label="Visit Vuori website" href="https://vuoriclothing.com/" rel="noreferrer" target="_blank">
          <em>Vuori</em>
        </a>
        .
      </m.p>

      <m.p variants={fade}>
        Among other things, I&apos;m a huge fan of the{' '}
        <m.em className={styles.giantsSlotContainer} animate="rest" initial="rest" whileHover="hover">
          <span className={styles.slot}>
            <m.span className={styles.textSlot} variants={textSlotVariants}>
              SF
            </m.span>
            <m.span className={styles.svgSlot} aria-hidden="true" variants={svgSlotVariants}>
              <Giants />
            </m.span>
          </span>
          <span> Giants</span>
        </m.em>{' '}
        and baseball in general. If baseball is your thing too, hit me up and maybe we can catch a game together.
      </m.p>

      <m.p variants={fade}>
        As for this site, it&apos;s a place where I can share my thoughts, projects, and experiences. No matter how you
        stumbled upon this site or what you&apos;re looking for, I hope you find something that resonates with you.
      </m.p>
    </m.section>
  )
}

export default Bio

const spring = { type: 'spring', stiffness: 300, damping: 20 } as const

const textSlotVariants = {
  rest: { y: 0, opacity: 1, transition: spring },
  hover: { y: '-100%', opacity: 0, transition: spring },
}

const svgSlotVariants = {
  rest: { y: '100%', opacity: 0, transition: spring },
  hover: { y: 0, opacity: 1, transition: spring },
}

// The slot container masks the overflowing text/SVG.

// The "SF" text which animates upward on hover.

// The SVG starts below and slides upward into view.

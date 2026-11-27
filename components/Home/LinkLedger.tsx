import * as m from 'framer-motion/m'

import { staggerFade } from '../animation'
import SocialLinks from '../SocialLinks'
import FeaturedProjects from './FeaturedProjects'

import styles from './LinkLedger.module.css'

export default function LinkLedger() {
  return (
    <m.footer className={styles.ledger} id="link-ledger" variants={staggerFade}>
      <FeaturedProjects />
      <nav className={styles.profiles} aria-label="Social profiles">
        <SocialLinks unboxed />
      </nav>
    </m.footer>
  )
}

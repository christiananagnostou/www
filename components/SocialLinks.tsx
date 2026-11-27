import * as m from 'framer-motion/m'

import { fade } from './animation'
import Github from './SVG/GitHub'
import LinkedIn from './SVG/LinkedIn'
import Twitter from './SVG/Twitter'

import styles from './SocialLinks.module.css'

function SocialLinks({ unboxed = false }: { unboxed?: boolean }) {
  return (
    <m.ul data-unboxed={unboxed || undefined} className={styles.socialLinkList} variants={fade}>
      <li>
        <a aria-label="GitHub" href="https://github.com/ChristianAnagnostou" rel="noreferrer" target="_blank">
          <Github />
        </a>
      </li>
      <li>
        <a aria-label="LinkedIn" href="https://linkedin.com/in/ChristianAnagnostou/" rel="noreferrer" target="_blank">
          <LinkedIn />
        </a>
      </li>
      <li>
        <a aria-label="X" href="https://x.com/javascramble" rel="noreferrer" target="_blank">
          <Twitter />
        </a>
      </li>
    </m.ul>
  )
}

export default SocialLinks

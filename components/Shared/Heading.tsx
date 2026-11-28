import * as m from 'framer-motion/m'
import type { HTMLMotionProps } from 'framer-motion'

import styles from './Heading.module.css'

export function Heading({ className, ...props }: HTMLMotionProps<'div'>) {
  return <m.div {...props} className={className ? `${styles.heading} ${className}` : styles.heading} />
}

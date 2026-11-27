import Link from 'next/link'

import AnimatedFire from '../SVG/AnimatedFire'
import Experiment from '../SVG/Experiment'

import styles from './LabLink.module.css'

const LabLink = () => {
  return (
    <Link className={styles.link} href="/lab">
      <Experiment />
      The Lab
      <AnimatedFire />
    </Link>
  )
}

export default LabLink

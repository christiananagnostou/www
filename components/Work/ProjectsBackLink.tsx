import Link from 'next/link'

import styles from './ProjectsBackLink.module.css'

export default function ProjectsBackLink() {
  return (
    <Link className={styles.back} href="/projects">
      / Projects
    </Link>
  )
}

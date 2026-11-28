import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'

import JukeboxLogo from '../../public/logo-jukebox.webp'
import LiftClubLogo from '../../public/logo-liftclub.webp'
import { fade, staggerFade } from '../animation'
import RightArrow from '../SVG/RightArrow'

import styles from './FeaturedProjects.module.css'

const projects = [
  {
    name: 'Lift Club',
    href: '/work/liftclub',
    detail: 'Workout journal',
    mark: <Image alt="" src={LiftClubLogo} width={28} />,
  },
  {
    name: 'Jukebox',
    href: '/work/jukebox',
    detail: 'Local & remote music',
    mark: <Image alt="" src={JukeboxLogo} height={26} />,
  },
  {
    name: 'ImgPress',
    href: '/work/imgpress',
    detail: 'Image compressor',
    mark: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.35">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M9.7 8h10.9M14.3 8l5.5 9.5M16.6 12l-5.4 9.5M14.3 16H3.4M9.7 16 4.2 6.5M7.4 12l5.4-9.5" />
      </svg>
    ),
  },
]

export default function FeaturedProjects() {
  return (
    <m.nav className={styles.projects} aria-label="Selected projects" variants={staggerFade}>
      <m.div className={styles.header} variants={fade}>
        <h2>Projects</h2>
        <Link href="/projects" prefetch={false}>
          All projects{' '}
          <span aria-hidden="true">
            <RightArrow />
          </span>
        </Link>
      </m.div>
      <ul>
        {projects.map(({ name, href, detail, mark }) => (
          <m.li key={href} variants={fade}>
            <Link className={styles.project} href={href} prefetch={false}>
              <span className={styles.mark} aria-hidden="true">
                {mark}
              </span>
              <span className={styles.copy}>
                <strong>{name}</strong>
                <small>{detail}</small>
              </span>
            </Link>
          </m.li>
        ))}
      </ul>
    </m.nav>
  )
}

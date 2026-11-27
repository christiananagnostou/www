import * as m from 'framer-motion/m'
import Image from 'next/image'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'
import ProjectsBackLink from './ProjectsBackLink'
import { projectTheme } from './projectTheme'

import styles from './JukeboxStudy.module.css'

const controls = [
  ['/', 'Search'],
  ['j / k', 'Move selection'],
  ['Enter', 'Play selection'],
  ['q', 'Queue track'],
] as const

export default function JukeboxStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [library, listen] = project.desktopImgs
  const [phone] = project.mobileImgs
  const [importing, keyboard, history, remote] = project.details
  return (
    <m.main
      className={styles.page}
      style={projectTheme(project.themeColor)}
      initial={initial}
      animate="show"
      exit="exit"
      variants={pageAnimation}
    >
      <ProjectsBackLink />
      <header>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className={styles.actions}>
          <a href={project.externalLink}>View releases ↗</a>
          <a href={project.github}>Source on GitHub</a>
        </div>
      </header>
      <figure className={styles.sleeve}>
        <a href={library.src} aria-label="View the full-size Jukebox Songs screen">
          <Image
            priority
            src={library}
            sizes="(min-width: 800px) 720px, 95vw"
            alt="Jukebox Songs view with a local track list and the current track, Room Tone, in the playback sidebar."
          />
        </a>
      </figure>
      <section className={styles.note}>
        <h2>{importing.title}</h2>
        <p>{importing.description}</p>
      </section>
      <section className={styles.listen}>
        <div>
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>
        <Image
          src={listen}
          sizes="(min-width: 800px) 335px, (min-width: 650px) 44vw, 90vw"
          alt="Most played tracks, with Side Two at the top of the list."
        />
      </section>
      <section className={styles.note}>
        <h2>{keyboard.title}</h2>
        <div>
          <p>{keyboard.description}</p>
          <dl className={styles.keys}>
            {controls.map(([key, action]) => (
              <div key={key}>
                <dt>
                  <kbd>{key}</kbd>
                </dt>
                <dd>{action}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={styles.remote}>
        <div>
          <h2>{remote.title}</h2>
          <p>{remote.description}</p>
        </div>
        <figure>
          <Image
            src={phone}
            sizes="(min-width: 380px) 232px, 64vw"
            alt="Jukebox on a phone, playing Room Tone with queue and Save offline controls."
          />
        </figure>
      </section>
      <footer>
        {project.meta[0].value} <span aria-hidden="true">·</span> {project.meta[1].value}
      </footer>
    </m.main>
  )
}

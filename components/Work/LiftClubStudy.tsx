import * as m from 'framer-motion/m'
import Image from 'next/image'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'
import ProjectsBackLink from './ProjectsBackLink'
import { projectTheme } from './projectTheme'

import styles from './LiftClubStudy.module.css'

const coverSizes = '(min-width: 800px) 615px, (min-width: 650px) calc(80vw - 25.6px), calc(100vw - 32px)'

export default function LiftClubStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [cover, communityCollage] = project.desktopImgs
  const [progress] = project.mobileImgs
  const [origin, history, community, today] = project.details
  const app = project.externalLink!

  return (
    <m.main
      className={styles.page}
      style={projectTheme(project.themeColor)}
      initial={initial}
      variants={pageAnimation}
      animate="show"
      exit="exit"
    >
      <ProjectsBackLink />
      <header className={styles.intro}>
        <div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className={styles.actions}>
            <a href={app}>
              Visit Lift Club <span aria-hidden="true">↗</span>
            </a>
            <a href={new URL('signup', app).href}>Sign up</a>
          </div>
        </div>
        <figure className={styles.cover}>
          <Image
            src={cover}
            priority
            sizes={`(min-width: 1200px) 400px, ${coverSizes}`}
            alt="A tilted Lift Club bench press log showing today's reps and weight beside the previous session."
          />
        </figure>
      </header>
      <StoryNote {...origin} />
      <section className={styles.progress}>
        <div className={styles.progressCopy}>
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>
        <Image
          src={progress}
          alt="Low cable crossover training volume trends upward across 37 sessions, peaking at 1,620 kg."
          sizes="(min-width: 800px) 278px, (min-width: 650px) calc(40vw - 40px), calc(100vw - 64px)"
        />
      </section>
      <StoryNote {...community} />
      <figure className={styles.cover}>
        <Image
          src={communityCollage}
          sizes={coverSizes}
          alt="Two screens from the Lift Club demo: Christian follows George and Dobby, and George’s leg day opens in the workout feed."
        />
      </figure>
      <StoryNote {...today} />
    </m.main>
  )
}

function StoryNote({ title, description }: ProjectType['details'][number]) {
  return (
    <section className={styles.note}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}

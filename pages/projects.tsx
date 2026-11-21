import * as m from 'framer-motion/m'
import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { CSSProperties } from 'react'

import { fade, pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { Heading } from '../components/Shared/Heading'
import ProjectCategoryNav from '../components/Work/ProjectCategoryNav'
import ProjectInstrument from '../components/Work/ProjectInstrument'
import { projectTheme } from '../components/Work/projectTheme'
import ProjectHead from '../components/Work/ProjectHead'
import styles from '../components/Work/ProjectsIndex.module.css'
import { ProjectState } from '../lib/projects'
import { getProjectCategory } from '../lib/projects/categories'
import { getProjectsStructuredData, projectsDescription, projectsUrl } from '../lib/structured/projects'

const featured = ['liftclub', 'jukebox']

const shortDescriptions: Record<string, string> = {
  liftclub: 'The workout log I started for my cousin George and me.',
  jukebox: 'A player for my music library, at my desk or on my phone.',
  imgpress: 'A Mac menu bar app for compressing and converting photos.',
  skillbox: 'A local manager for the skills I use across coding agents.',
  'knip-html-reporter': 'A searchable HTML report for unused files, exports, and dependencies.',
  qwikdraw: 'A drawing canvas built with Qwik.',
  'electriq-app': 'Timelines, boards, and calendars for managing projects in Linear.',
  soylent: 'The online store for Soylent’s drinks and nutrition products.',
  scentfill: 'A storefront for finding scents and subscribing to refills.',
  'electriq-home': 'The agency’s new site, built with Electriq’s in-house design team.',
  awildchristian: 'My photography shop for signed prints.',
  neologos: 'A dictionary where people can invent words and vote on definitions.',
  lofiwaves: 'A little player for the lo-fi tracks I code to.',
}

export function getStaticProps() {
  const ordered = [
    ...featured.map((slug) => {
      const project = ProjectState.find((entry) => entry.slug === slug)
      if (!project) throw new Error(`Missing selected project: ${slug}`)
      return project
    }),
    ...ProjectState.filter(({ slug }) => !featured.includes(slug)),
  ]

  return {
    props: {
      projects: ordered.map(({ title, slug, date, summary, themeColor, meta, tags }) => ({
        title,
        slug,
        themeColor,
        tags,
        medium: meta[0]?.value ?? '',
        year: date.replace(/^[A-Za-z]+ /, '').replace('-', '–'),
        description: shortDescriptions[slug] ?? summary,
      })),
      structured: getProjectsStructuredData(ordered),
    },
  }
}

export default function Projects({ projects, structured }: InferGetStaticPropsType<typeof getStaticProps>) {
  const pageTransitionInitial = usePageTransitionInitial()
  const selected = getProjectCategory(useRouter().query.tag)
  const visible = selected ? projects.filter(({ tags }) => tags.includes(selected)) : projects
  return (
    <>
      <ProjectHead
        title="Projects | Christian Anagnostou"
        description={projectsDescription}
        url={projectsUrl}
        structured={structured}
      />
      <m.div
        className={styles.page}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <Heading variants={fade} className={styles.heading}>
          <h1>Projects</h1>
          <p>
            The following showcase contains a selection of my work from freelance projects, past jobs, personal
            projects, and open-source. Carving and polishing this craft has been a passion of mine for over a decade and
            I&apos;ve had the pleasure of working with some amazing people and companies along the way.
          </p>
          <ProjectCategoryNav selected={selected} />
        </Heading>
        <ul className={styles.list} aria-label="Projects">
          {visible.map(({ title, slug, year, themeColor, description, medium }, index) => (
            <li key={slug} style={{ ...projectTheme(themeColor), '--order': Math.min(index, 5) } as CSSProperties}>
              <Link className={styles.row} href={`/work/${slug}`} aria-labelledby={slug}>
                <div className={styles.art}>
                  <ProjectInstrument slug={slug} />
                </div>
                <div className={styles.copy}>
                  <h2 id={slug}>{title}</h2>
                  <p>{description}</p>
                  <InstrumentDetail slug={slug} medium={medium} />
                </div>
                <small className={styles.year}>{year}</small>
              </Link>
            </li>
          ))}
        </ul>
      </m.div>
    </>
  )
}

function InstrumentDetail({ slug, medium }: { slug: string; medium: string }) {
  switch (slug) {
    case 'liftclub':
      return (
        <div className={styles.detail}>
          <span>Workout log</span>
          <b>Bench press</b>
        </div>
      )
    case 'jukebox':
      return (
        <div className={styles.detail}>
          <kbd>/</kbd> Search <kbd>q</kbd> Queue track
        </div>
      )
    case 'imgpress':
      return (
        <div className={styles.detail}>
          <span>3 JPEGs</span>
          <b>566 kB → 228 kB</b>
        </div>
      )
    default:
      return <div className={styles.detail}>{medium}</div>
  }
}

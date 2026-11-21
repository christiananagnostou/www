import * as m from 'framer-motion/m'
import type { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { pageAnimation } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import ProjectInstrument from '../components/Work/ProjectInstrument'
import { projectTheme } from '../components/Work/projectTheme'
import ProjectHead from '../components/Work/ProjectHead'
import styles from '../components/Work/ProjectsIndex.module.css'
import { ProjectState } from '../lib/projects'
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
      projects: ordered.map(({ title, slug, date, summary, themeColor, meta }) => ({
        title,
        slug,
        themeColor,
        medium: meta[0]?.value ?? '',
        year: date.replace(/^[A-Za-z]+ /, '').replace('-', '–'),
        description: shortDescriptions[slug] ?? summary,
      })),
      structured: getProjectsStructuredData(ordered),
    },
  }
}

export default function Projects({ projects, structured }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <ProjectHead
        title="Projects | Christian Anagnostou"
        description={projectsDescription}
        url={projectsUrl}
        structured={structured}
      />
      <m.div className={styles.page} exit={pageAnimation.exit}>
        <Heading>
          <h1>Projects</h1>
          <p>A selection of personal projects, open-source tools, and work I’ve done with other teams.</p>
        </Heading>
        <ul className={styles.list} aria-label="Projects">
          {projects.map(({ title, slug, year, themeColor, description, medium }, index) => (
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

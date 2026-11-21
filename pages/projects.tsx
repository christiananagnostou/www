import * as m from 'framer-motion/m'
import type { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { pageAnimation } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import ProjectDesigns from '../components/Work/ProjectDesigns'
import ProjectHead from '../components/Work/ProjectHead'
import styles from '../components/Work/ProjectsIndex.module.css'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData, projectsDescription, projectsUrl } from '../lib/structured/projects'
import jukeboxIcon from '../public/logo-jukebox.webp'
import liftClubIcon from '../public/logo-liftclub.webp'

const selected = new Map([
  ['liftclub', liftClubIcon],
  ['jukebox', jukeboxIcon],
])

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
    ...Array.from(selected.keys()).map((slug) => {
      const project = ProjectState.find((entry) => entry.slug === slug)
      if (!project) throw new Error(`Missing selected project: ${slug}`)
      return project
    }),
    ...ProjectState.filter(({ slug }) => !selected.has(slug)),
  ]

  return {
    props: {
      compare: process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development',
      projects: ordered.map(({ title, slug, date, summary, desktopImgs, mobileImgs, meta }) => ({
        title,
        slug,
        icon: selected.get(slug) ?? null,
        image: desktopImgs[0]?.src ?? null,
        detail: (mobileImgs[0] ?? desktopImgs[1])?.src ?? null,
        medium: meta[0]?.value ?? '',
        year: date.replace(/^[A-Za-z]+ /, '').replace('-', '–'),
        description: shortDescriptions[slug] ?? summary,
      })),
      structured: getProjectsStructuredData(ordered),
    },
  }
}

export default function Projects({ projects, structured, compare }: InferGetStaticPropsType<typeof getStaticProps>) {
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
        {compare ? (
          <ProjectDesigns projects={projects} />
        ) : (
          <ul className={styles.list} aria-label="Projects">
            {projects.map(({ title, slug, year, description, icon }, index) => (
              <li key={slug} style={{ '--order': index } as CSSProperties}>
                <Link href={`/work/${slug}`} aria-labelledby={slug}>
                  <h2 id={slug}>
                    {icon && <Image src={icon} alt="" width={18} height={18} />}
                    {title}
                  </h2>
                  <p>{description}</p>
                  <span>{year}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </m.div>
    </>
  )
}

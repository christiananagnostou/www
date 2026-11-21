import * as m from 'framer-motion/m'
import type { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { pageAnimation } from '../components/animation'
import ProjectHead from '../components/Work/ProjectHead'
import styles from '../components/Work/ProjectsIndex.module.css'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData, projectsDescription, projectsUrl } from '../lib/structured/projects'
import conversion from '../public/img/projects/imgpress/conversion.webp'

const features = [
  {
    slug: 'liftclub',
    copy: 'I built a workout log so my cousin George and I could pick up where we left off at the gym.',
  },
  {
    slug: 'jukebox',
    copy: 'A desktop player for my own music library. I can queue a record with the keyboard or listen from my phone.',
  },
  {
    slug: 'imgpress',
    image: conversion,
    copy: 'I use this Mac menu bar app to get photos ready to share. One batch of three went from 566 kB to 228 kB.',
  },
]

const shortDescriptions: Record<string, string> = {
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
  const selected = features.map(({ slug }) => {
    const project = ProjectState.find((entry) => entry.slug === slug)
    if (!project) throw new Error(`Missing featured project: ${slug}`)
    return project
  })
  const others = ProjectState.filter((entry) => !selected.includes(entry))
  return {
    props: {
      featured: selected.map(({ title, slug, desktopImgs }, i) => ({
        ...features[i],
        title,
        slug,
        image: features[i].image ?? desktopImgs[0],
      })),
      archive: others.map(({ title, slug, date, summary }) => ({
        title,
        slug,
        year: date.replace(/^[A-Za-z]+ /, '').replace('-', '–'),
        description: shortDescriptions[slug] ?? summary,
      })),
      structured: getProjectsStructuredData([...selected, ...others]),
    },
  }
}

export default function Projects({ featured, archive, structured }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <ProjectHead
        title="Projects | Christian Anagnostou"
        description={projectsDescription}
        url={projectsUrl}
        structured={structured}
      />
      <m.div exit={pageAnimation.exit}>
        <div className={styles.page}>
          <h1>Projects</h1>
          <section aria-label="Featured projects">
            {featured.map(({ slug, title, image, copy }, index) => (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className={index === 0 ? styles.lead : styles.feature}
                style={{ '--order': index + 1 } as CSSProperties}
                aria-labelledby={slug}
              >
                <div>
                  <h2 id={slug}>{title}</h2>
                  <p>{copy}</p>
                  {index === 0 && <span className={styles.read}>View project</span>}
                </div>
                <div className={styles.art} data-project={slug}>
                  <Image
                    src={image}
                    alt=""
                    priority={index === 0}
                    sizes={
                      index === 0
                        ? '(min-width: 801px) 410px, (min-width: 601px) 53vw, 100vw'
                        : '(min-width: 800px) 256px, 32vw'
                    }
                  />
                </div>
              </Link>
            ))}
          </section>
          <section className={styles.archive} aria-labelledby="more-projects">
            <h2 id="more-projects">More projects</h2>
            <ul>
              {archive.map(({ title, slug, year, description }, index) => (
                <li key={slug} style={{ '--order': index + 5 } as CSSProperties}>
                  <Link href={`/work/${slug}`} aria-labelledby={slug}>
                    <h3 id={slug}>{title}</h3>
                    <p>{description}</p>
                    <span>{year}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </m.div>
    </>
  )
}

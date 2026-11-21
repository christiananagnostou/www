import * as m from 'framer-motion/m'
import type { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import ProjectHead from '../components/Work/ProjectHead'
import styles from '../components/Work/ProjectsIndex.module.css'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData, projectsDescription, projectsUrl } from '../lib/structured/projects'
import bike from '../public/img/projects/imgpress/bay-bike-export.jpg'
import phone from '../public/img/projects/jukebox/remote-study.webp'
import workout from '../public/img/projects/liftclub/hero.webp'

const features = [
  {
    slug: 'liftclub',
    image: workout,
    copy: 'I built a workout log so my cousin George and I could pick up where we left off at the gym.',
  },
  {
    slug: 'jukebox',
    image: phone,
    copy: 'My records live on my desktop. Jukebox lets me listen to the same library on my phone.',
  },
  {
    slug: 'imgpress',
    image: bike,
    copy: 'A Mac menu bar app for getting photos ready to share. This bike photo went from 177.4 kB to 64.6 kB.',
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
      featured: selected.map(({ title, slug }, i) => ({ ...features[i], title, slug })),
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
  const initial = usePageTransitionInitial()
  return (
    <>
      <ProjectHead
        title="Projects | Christian Anagnostou"
        description={projectsDescription}
        url={projectsUrl}
        structured={structured}
      />
      <m.div className={styles.page} initial={initial} animate="show" exit="exit" variants={pageAnimation}>
        <h1>Projects</h1>
        <section aria-label="Featured projects">
          {featured.map(({ slug, title, image, copy }, index) => (
            <Link
              key={slug}
              href={`/work/${slug}`}
              className={index === 0 ? styles.lead : styles.feature}
              aria-labelledby={slug}
            >
              <div>
                <h2 id={slug}>{title}</h2>
                <p>{copy}</p>
                {index === 0 && <span className={styles.read}>Read the case study</span>}
              </div>
              <div className={`${styles.art} ${styles[slug]}`}>
                <Image
                  src={image}
                  alt=""
                  priority={index === 0}
                  sizes={
                    index === 0
                      ? '(min-width: 801px) 410px, (min-width: 601px) 53vw, 100vw'
                      : slug === 'jukebox'
                        ? '70px'
                        : '144px'
                  }
                />
              </div>
            </Link>
          ))}
        </section>
        <section className={styles.archive} aria-labelledby="more-projects">
          <h2 id="more-projects">More projects</h2>
          <ul>
            {archive.map(({ title, slug, year, description }) => (
              <li key={slug}>
                <Link href={`/work/${slug}`} aria-labelledby={slug}>
                  <h3 id={slug}>{title}</h3>
                  <p>{description}</p>
                  <span>{year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </m.div>
    </>
  )
}

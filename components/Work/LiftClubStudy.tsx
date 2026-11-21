import * as m from 'framer-motion/m'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'

const editions = {
  overview: {
    label: 'Overview',
    line: 'The training log, from first set to last.',
    caption: 'The live Lift Club homepage and interactive logger.',
  },
  set: {
    label: 'Set sheet',
    line: 'Last time, right beside this time.',
    caption: 'Low cable crossover · four working sets.',
  },
  record: {
    label: 'Training record',
    line: 'The weeks behind a single lift.',
    caption: 'Exercise history · volume across recorded sessions.',
  },
} as const
type Edition = keyof typeof editions
const order: Edition[] = ['overview', 'set', 'record']

export default function LiftClubStudy({ project, compare }: { project: ProjectType; compare?: boolean }) {
  const initial = usePageTransitionInitial()
  const [edition, setEdition] = useState<Edition>('overview')
  useEffect(() => {
    if (!compare) return
    const sync = () => setEdition(order.find((key) => '#' + key === window.location.hash) ?? 'overview')
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [compare])
  const shots = { overview: project.desktopImgs[0], set: project.mobileImgs[0], record: project.mobileImgs[1] }
  const selected = editions[edition]
  const others = order.filter((key) => key !== edition)
  const product = project.externalLink!
  const shot = (key: Edition, priority = false) => (
    <figure>
      <Image
        src={shots[key]}
        alt={editions[key].caption}
        priority={priority}
        sizes={key === 'overview' ? '(min-width: 800px) 768px, 94vw' : '(min-width: 600px) 360px, 86vw'}
      />
      <figcaption>{editions[key].caption}</figcaption>
    </figure>
  )

  return (
    <>
      <Head>
        <title>Lift Club | Christian Anagnostou</title>
        <meta name="description" content={project.summary} />
      </Head>
      <Page initial={initial} variants={pageAnimation} animate="show" exit="exit" data-edition={edition}>
        <Top>
          <Link href="/projects">← Projects</Link>
          {compare && (
            <nav aria-label="Compare mockups">
              {order.map((key) => (
                <a key={key} href={'#' + key} aria-current={edition === key ? 'true' : undefined}>
                  {editions[key].label}
                </a>
              ))}
            </nav>
          )}
        </Top>
        <Hero>
          <header>
            <small>Personal project / Since 2021</small>
            <h1>Lift Club</h1>
            <p>{selected.line}</p>
            <Actions>
              <a href={product}>Open Lift Club ↗</a>
              <a href={new URL('signup', product).href}>Sign up ↗</a>
            </Actions>
          </header>
          {shot(edition, true)}
        </Hero>
        <Story>
          <div>
            <small>Project notes</small>
            <h2>A log you can use between sets.</h2>
          </div>
          <div>
            <p>{project.summary}</p>
            {project.details.map((detail) => (
              <section key={detail.title}>
                <h3>{detail.title}</h3>
                <p>{detail.description}</p>
              </section>
            ))}
          </div>
        </Story>
        <Gallery aria-label="More product screenshots">
          {others.map((key) => (
            <div key={key}>{shot(key)}</div>
          ))}
        </Gallery>
      </Page>
    </>
  )
}

const Page = styled(m.main)`
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 2rem 1rem 5rem;
  color: var(--text);

  small,
  figcaption {
    font-size: 0.78rem;
  }
  small {
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  figure {
    margin: 0;
    min-width: 0;
  }
  figure img {
    display: block;
    width: 100%;
    height: auto;
  }
  figcaption {
    margin-top: 0.65rem;
    line-height: 1.4;
  }
  a {
    color: inherit;
  }
`
const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  font-size: 0.85rem;
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  nav a {
    padding: 0.45rem 0.6rem;
    text-decoration: none;
    border-bottom: 2px solid transparent;
  }
  nav a[aria-current],
  nav a:hover {
    border-color: currentcolor;
  }
`
const Hero = styled.div`
  display: grid;
  gap: 1.5rem;
  align-items: center;
  header p {
    font-size: 1.25rem;
    line-height: 1.4;
  }
  h1 {
    margin: 0.8rem 0;
    color: var(--heading);
    font-weight: 500;
    font-size: clamp(3rem, 9vw, 5rem);
    line-height: 1;
  }
  figure {
    padding: 1rem;
    background: var(--dark-bg);
    border: 1px solid var(--accent);
  }
  [data-edition='set'] & {
    background: #efece2;
    color: #393931;
    padding: clamp(1rem, 4vw, 2.5rem);
    border-top: 0.35rem solid #a84830;
  }
  [data-edition='set'] & h1 {
    color: #24251f;
  }
  [data-edition='set'] & figure {
    color: #e5e3db;
    background: #20211f;
  }
  [data-edition='record'] & {
    border-block: 1px solid var(--accent);
    padding-block: 1.5rem;
  }
  [data-edition='record'] & figure {
    max-width: 22rem;
    margin: auto;
  }
  @media (width >= 620px) {
    [data-edition='set'] & {
      grid-template-columns: 1fr 1.1fr;
    }
    [data-edition='record'] & {
      grid-template-columns: 1fr 1fr;
    }
    [data-edition='record'] & figure {
      order: -1;
    }
  }
`
const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  a {
    text-underline-offset: 0.3em;
  }
`
const Story = styled.section`
  display: grid;
  gap: 1.5rem;
  margin: 3rem 0;
  h2 {
    margin: 0.6rem 0;
    font-size: 1.8rem;
    font-weight: 500;
  }
  h3 {
    margin: 1.2rem 0 0.3rem;
    font-size: 1rem;
  }
  p {
    margin: 0;
    line-height: 1.65;
  }
  @media (width >= 620px) {
    grid-template-columns: 1fr 1.5fr;
  }
`
const Gallery = styled.section`
  display: grid;
  gap: 1rem;
  align-items: start;
  padding-top: 1.5rem;
  border-top: 1px solid var(--accent);
  figure {
    padding: 0.8rem;
    background: var(--dark-bg);
  }
  @media (width >= 620px) {
    grid-template-columns: 1fr 1fr;
  }
`

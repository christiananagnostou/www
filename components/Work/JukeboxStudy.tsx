import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'

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
    <Page initial={initial} animate="show" exit="exit" variants={pageAnimation}>
      <Link href="/projects">/ Projects</Link>
      <header>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <Actions>
          <a href={project.externalLink}>View releases ↗</a>
          <a href={project.github}>Source on GitHub</a>
        </Actions>
      </header>
      <Sleeve>
        <a href={library.src} aria-label="View the full-size Jukebox Songs screen">
          <Image
            priority
            src={library}
            sizes="(min-width: 800px) 720px, 95vw"
            alt="Jukebox Songs view with a local track list and the current track, Room Tone, in the playback sidebar."
          />
        </a>
        <figcaption>
          <span>Songs / Desktop player</span>
          <span>Demo library</span>
        </figcaption>
      </Sleeve>
      <Note>
        <h2>{importing.title}</h2>
        <p>{importing.description}</p>
      </Note>
      <Listen>
        <div>
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>
        <Image
          src={listen}
          sizes="(min-width: 800px) 335px, (min-width: 650px) 44vw, 90vw"
          alt="Most played in the demo library, with Side Two at the top of the list."
        />
      </Listen>
      <Note>
        <h2>{keyboard.title}</h2>
        <div>
          <p>{keyboard.description}</p>
          <Keys>
            {controls.map(([key, action]) => (
              <div key={key}>
                <dt>
                  <kbd>{key}</kbd>
                </dt>
                <dd>{action}</dd>
              </div>
            ))}
          </Keys>
        </div>
      </Note>
      <Remote>
        <div>
          <h2>{remote.title}</h2>
          <p>{remote.description}</p>
        </div>
        <figure>
          <Image
            src={phone}
            sizes="(min-width: 380px) 232px, 64vw"
            alt="Jukebox on a phone, playing Room Tone from Field Notes, with queue and Save offline controls."
          />
        </figure>
      </Remote>
      <footer>
        {project.meta[0].value} <span aria-hidden="true">·</span> {project.meta[1].value}
      </footer>
    </Page>
  )
}

const Page = styled(m.main)`
  --ink-blue: #a8c1eb;
  width: 100%;
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 2rem 1rem 4rem;
  color: var(--text);
  > a,
  footer {
    color: var(--text-dark);
    font-size: 0.85rem;
  }
  header {
    margin: 2.8rem 0 1.75rem;
  }
  h1,
  h2 {
    color: var(--heading);
    font-weight: 500;
    letter-spacing: -0.045em;
    line-height: 1.05;
  }
  h1 {
    font-size: clamp(3.4rem, 9vw, 5.4rem);
  }
  h2 {
    font-size: clamp(1.45rem, 4vw, 1.85rem);
  }
  p {
    line-height: 1.65;
    margin-top: 0.85rem;
  }
  header p {
    max-width: 34rem;
    font-size: 1.1rem;
  }
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  a:focus-visible {
    outline: 2px solid var(--ink-blue);
    outline-offset: 4px;
  }
  footer {
    margin-top: 2rem;
  }
`
const Actions = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  a {
    color: var(--ink-blue);
    text-underline-offset: 0.25em;
  }
  a:first-child {
    padding: 0.65rem 1rem;
    border-radius: var(--border-radius-sm);
    background: var(--ink-blue);
    color: #17171f;
    text-decoration: none;
  }
`
const Sleeve = styled.figure`
  margin: 0;
  padding: clamp(0.7rem, 3vw, 1.7rem);
  border-radius: var(--border-radius-lg);
  background:
    repeating-radial-gradient(circle at 86% 120%, transparent 0 5px, #ffffff08 6px, transparent 7px),
    linear-gradient(125deg, #303747, #475974 65%, #263144);
  a {
    display: block;
  }
  img {
    border-radius: var(--border-radius-sm);
    box-shadow: 0 8px 24px #11132066;
  }
  figcaption {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    margin-top: 0.85rem;
    color: #e2e8f0;
    font-size: 0.76rem;
  }
`
const Note = styled.section`
  display: grid;
  gap: 0.7rem;
  padding-block: clamp(2rem, 6vw, 3.25rem);
  p {
    margin: 0;
  }
  @media (width >= 650px) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 13fr);
    gap: 2.5rem;
  }
`
const Keys = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.4rem 0.8rem;
  margin: 1.1rem 0 0;
  align-items: center;
  div {
    display: contents;
  }
  dt,
  dd {
    margin: 0;
  }
  dd {
    font-size: 0.85rem;
    color: var(--text);
  }
  kbd {
    display: inline-block;
    padding: 0.2rem 0.42rem;
    border: 1px solid #424a5a;
    border-bottom-width: 2px;
    border-radius: 4px;
    color: var(--ink-blue);
    font-size: 0.78rem;
  }
`
const Listen = styled.section`
  display: grid;
  align-items: center;
  gap: 1.3rem;
  padding: clamp(1rem, 3vw, 1.6rem);
  background: #22232e;
  border-radius: var(--border-radius-lg);
  @media (width >= 650px) {
    grid-template-columns: 1.1fr 1fr;
    gap: 2rem;
  }
`
const Remote = styled(Listen)`
  background: radial-gradient(ellipse at bottom right, #364554, #20252e 65%);
  border-radius: var(--border-radius-lg);
  figure {
    margin: 0 auto;
    width: min(100%, 14.5rem);
    border: 5px solid #101115;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 12px 24px #11132066;
  }
`

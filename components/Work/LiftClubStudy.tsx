import * as m from 'framer-motion/m'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'

export default function LiftClubStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [cover] = project.desktopImgs
  const [set, progress] = project.mobileImgs
  const [session, history] = project.details
  const app = project.externalLink!

  return (
    <>
      <Head>
        <title>Lift Club | Christian Anagnostou</title>
        <meta name="description" content={project.summary} />
      </Head>
      <Page initial={initial} variants={pageAnimation} animate="show" exit="exit">
        <Back href="/projects">/ Projects</Back>
        <Intro>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <Actions>
            <a href={app}>
              Explore Lift Club <span aria-hidden="true">↗</span>
            </a>
            <a href={new URL('signup', app).href}>Sign up</a>
          </Actions>
        </Intro>
        <Cover>
          <Image
            src={cover}
            priority
            sizes="(min-width: 800px) 768px, 95vw"
            alt="A tilted Lift Club bench press log showing today's reps and weight beside the previous session."
          />
          <figcaption>
            <span>Bench press in Lift Club</span>
            <a href={set.src}>See a sample workout</a>
          </figcaption>
        </Cover>
        <Note>
          <h2>{session.title}</h2>
          <p>{session.description}</p>
        </Note>
        <Progress>
          <div>
            <Image
              src={progress}
              alt="Volume history for low cable crossover, with peaks and dips across sixteen months of training."
              sizes="(min-width: 700px) 405px, 90vw"
            />
          </div>
          <section>
            <h2>{history.title}</h2>
            <p>{history.description}</p>
          </section>
        </Progress>
        <Footer>
          <div>
            <h2>Take it to the gym.</h2>
            <p>Add Lift Club to your home screen and open it between sets.</p>
          </div>
          <a href={new URL('install', app).href}>
            Install Lift Club <span aria-hidden="true">↗</span>
          </a>
        </Footer>
      </Page>
    </>
  )
}

const Page = styled(m.main)`
  width: 100%;
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 2rem 1rem 5rem;
  color: var(--text);
  h1,
  h2 {
    color: var(--heading);
    font-weight: 500;
  }
  h2 {
    font-size: clamp(1.4rem, 4vw, 2rem);
    line-height: 1.12;
    letter-spacing: -0.035em;
  }
  p {
    line-height: 1.65;
  }
  a {
    color: inherit;
    text-underline-offset: 0.25em;
  }
  a:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: 4px;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
  }
`
const Back = styled(Link)`
  font-size: 0.85rem;
  text-decoration: none;
`
const Intro = styled.header`
  margin: 2.8rem 0 1.6rem;
  h1 {
    font-size: clamp(3.4rem, 9vw, 5.3rem);
    line-height: 1;
    letter-spacing: -0.055em;
  }
  p {
    max-width: 34rem;
    margin: 0.9rem 0 1.25rem;
    font-size: clamp(1.05rem, 2.5vw, 1.2rem);
  }
`
const Actions = styled.div`
  display: flex;
  gap: 1.3rem;
  align-items: center;
  font-size: 0.9rem;
  a:first-child {
    padding: 0.65rem 1rem;
    border-radius: var(--border-radius-md);
    background: var(--heading);
    color: var(--body-bg);
    text-decoration: none;
  }
`
const Cover = styled.figure`
  img {
    border-radius: var(--border-radius-lg);
  }
  figcaption {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.65rem;
    font-size: 0.8rem;
    color: var(--text-dark);
  }
`
const Note = styled.section`
  display: grid;
  gap: 0.7rem 2rem;
  align-items: start;
  padding: clamp(2rem, 6vw, 3.5rem) 0;
  @media (width >= 650px) {
    grid-template-columns: 0.95fr 1.25fr;
  }
`
const Progress = styled.div`
  display: grid;
  align-items: center;
  gap: 1.7rem;
  background: var(--dark-bg);
  padding: clamp(1rem, 3vw, 1.6rem);
  border-radius: var(--border-radius-lg);
  img {
    border-radius: var(--border-radius-sm);
  }
  p {
    margin-top: 0.8rem;
  }
  @media (width >= 650px) {
    grid-template-columns: 1.3fr 1fr;
  }
`
const Footer = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2.5rem;
  p {
    margin-top: 0.45rem;
    color: var(--text-dark);
  }
  a {
    font-size: 0.9rem;
  }
`

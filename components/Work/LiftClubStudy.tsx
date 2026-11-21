import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import type { ProjectType } from '../../lib/projects'
import { pageAnimation } from '../animation'
import { usePageTransitionInitial } from '../animation/MotionProvider'

export default function LiftClubStudy({ project }: { project: ProjectType }) {
  const initial = usePageTransitionInitial()
  const [cover, communityCollage] = project.desktopImgs
  const [progress] = project.mobileImgs
  const [origin, history, community, today] = project.details
  const app = project.externalLink!

  return (
    <Page initial={initial} variants={pageAnimation} animate="show" exit="exit">
      <Back href="/projects">/ Projects</Back>
      <Intro>
        <div>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <Actions>
            <a href={app}>
              Visit Lift Club <span aria-hidden="true">↗</span>
            </a>
            <a href={new URL('signup', app).href}>Sign up</a>
          </Actions>
        </div>
        <Cover>
          <Image
            src={cover}
            priority
            sizes="(min-width: 1200px) 400px, (min-width: 800px) 768px, 95vw"
            alt="A tilted Lift Club bench press log showing today's reps and weight beside the previous session."
          />
        </Cover>
      </Intro>
      <StoryNote {...origin} />
      <Progress>
        <div className="progress-copy">
          <h2>{history.title}</h2>
          <p>{history.description}</p>
        </div>
        <Image
          src={progress}
          alt="Low cable crossover training volume trends upward across 37 sessions, peaking at 1,620 kg."
          sizes="(min-width: 650px) 405px, calc(100vw - 64px)"
        />
      </Progress>
      <StoryNote {...community} />
      <Cover>
        <Image
          src={communityCollage}
          sizes="(min-width: 800px) 768px, 95vw"
          alt="Two screens from the Lift Club demo: Christian follows George and Dobby, and George’s leg day opens in the workout feed."
        />
      </Cover>
      <StoryNote {...today} />
    </Page>
  )
}

function StoryNote({ title, description }: ProjectType['details'][number]) {
  return (
    <Note>
      <h2>{title}</h2>
      <p>{description}</p>
    </Note>
  )
}

const Page = styled(m.main)`
  --story-columns: minmax(0, 9fr) minmax(0, 11fr);
  --story-gutter: 2.5rem;
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
  display: grid;
  gap: 1.6rem;
  margin-top: 2.8rem;
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
  @media (width >= 1200px) {
    grid-template-columns: var(--story-columns);
    align-items: center;
    gap: var(--story-gutter);
    margin-top: 2.25rem;
    h1 {
      font-size: 3.75rem;
    }
    p {
      margin: 0.75rem 0 1.25rem;
      font-size: 1.05rem;
      line-height: 1.5;
      text-wrap: pretty;
    }
  }
`
const Actions = styled.div`
  display: flex;
  gap: 1.3rem;
  align-items: center;
  font-size: 0.9rem;
  a:first-child {
    padding: 0.65rem 1rem;
    border-radius: var(--border-radius-sm);
    background: #4361ee;
    color: #ffffff;
    text-decoration: none;
  }
`
const Cover = styled.figure`
  img {
    border-radius: var(--border-radius-lg);
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
  @media (width >= 1200px) {
    grid-template-columns: var(--story-columns);
    column-gap: var(--story-gutter);
    padding-block: 3rem;

    ${Intro} + & {
      grid-template-columns: minmax(0, 38rem);
      gap: 0.6rem;
      padding-block: 2.75rem 2.25rem;
    }
  }
`
const Progress = styled.section`
  display: grid;
  align-items: center;
  gap: 1rem;
  background: var(--dark-bg);
  padding: clamp(1rem, 3vw, 1.6rem);
  border-radius: var(--border-radius-lg);
  img {
    border-radius: var(--border-radius-md);
  }
  p {
    margin-top: 0.8rem;
  }
  @media (width >= 650px) {
    grid-template-columns: 1.3fr 1fr;
    gap: 1.7rem;
    .progress-copy {
      grid-area: 1 / 2;
    }
  }
`

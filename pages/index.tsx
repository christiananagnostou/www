import { motion } from 'framer-motion'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import { pageAnimation } from '../components/animation'
import Bio from '../components/Home/Bio'
import FeaturedProjects from '../components/Home/FeaturedProjects'
import LatestSection from '../components/Home/LatestSection'
import TVBar from '../components/Home/TVBar'
import SocialLinks from '../components/SocialLinks'
import Experiment from '../components/SVG/Experiment'
import { ArticleType, getAllPosts } from '../lib/articles'

type Props = {
  posts: ArticleType[]
}

export const getStaticProps: GetStaticProps = () => {
  const posts = getAllPosts()
  return { props: { posts } }
}

const Home = ({ posts }: Props) => {
  const [showRevealBar, setShowRevealBar] = useState(false)

  const revealBarStyle = showRevealBar
    ? { marginTop: '-1rem', opacity: 0.7, height: 50, transition: 'opacity .75s .15s ease, height .3s ease' }
    : { marginTop: '-1rem', opacity: 0, height: 0, transition: 'opacity .3s ease, height .3s .1s ease' }

  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <div className="page-inner-container">
          <TVBar setShowSignature={setShowRevealBar} />

          <Bio />

          <LatestSection posts={posts} />

          <FlexWrap>
            <FeaturedProjects />

            <SocialLinks />
          </FlexWrap>

          <FlexWrap style={revealBarStyle}>
            <ExperimentsLink href="/lab">
              <Experiment />
              Laboratory
              <svg className="fire-svg">
                <filter id="fire">
                  <feTurbulence id="turbulence" baseFrequency="0.1 0.1" numOctaves="10" seed="30">
                    <animate
                      attributeName="baseFrequency"
                      dur="10s"
                      values="0.1 0.1;0.1 0.2;0.1 0.1"
                      repeatCount="indefinite"
                    ></animate>
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" scale="3"></feDisplacementMap>
                </filter>
              </svg>
            </ExperimentsLink>

            <Signature src="/signature.png" height={50} width={100} alt="Signature of Christian Anagnostou" />
          </FlexWrap>
        </div>
      </Container>
    </>
  )
}

export default Home

const Container = styled(motion.main)`
  max-width: var(--max-w-screen);
  min-height: calc(100vh - var(--nav-height));
  margin: auto;
  padding: 2rem 1rem 1rem;

  .page-inner-container {
    border: 1px solid var(--accent);
    background: var(--body-bg);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 1rem;
    border-radius: 14px;
    position: relative;
  }
`

const FlexWrap = styled(motion.section)`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
`

const ExperimentsLink = styled(Link)`
  filter: url(#fire);
  --fire-color: var(--text-dark);

  display: flex;
  gap: 0.25rem;
  align-items: center;
  border-radius: 5px;
  font-size: 1rem;
  letter-spacing: 0.03em;

  top: 0.5rem;
  position: relative;

  text-decoration: none !important;
  color: var(--fire-color) !important;
  text-shadow: 0 0 1px var(--fire-color), 0 0 1px var(--fire-color), 0 0 1px var(--fire-color);
  transition: all 0.3s ease-in-out;

  .fire-svg {
    height: 0;
    width: 0;
  }

  &:hover {
    --fire-color: #ff8c3b;
    text-shadow: 0 0 10px var(--fire-color), 0 0 40px var(--fire-color), 0 0 80px var(--fire-color);
  }
`

const Signature = styled(Image)`
  display: block;
  pointer-events: none;
  user-select: none;
  transform-origin: center center;
  transform: translateY(0.5rem) scale(0.9);
`

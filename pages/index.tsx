import { motion } from 'framer-motion'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'
import { pageAnimation } from '../components/animation'
import Bio from '../components/Home/Bio'
import FeaturedProjects from '../components/Home/FeaturedProjects'
import LatestSection from '../components/Home/LatestSection'
import TVBar from '../components/Home/TVBar'
import SocialLinks from '../components/SocialLinks'
import { ArticleType, getAllPosts } from '../lib/articles'

type Props = {
  posts: ArticleType[]
}

export const getStaticProps: GetStaticProps = () => {
  const posts = getAllPosts()
  return { props: { posts } }
}

const Home = ({ posts }: Props) => {
  const [showSignature, setShowSignature] = useState(false)

  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <div className="page-inner-container">
          <TVBar setShowSignature={setShowSignature} />

          <Bio />

          <LatestSection posts={posts} />

          <FlexWrap>
            <FeaturedProjects />

            <SocialLinks />
          </FlexWrap>

          <Signature
            src="/signature.png"
            style={
              showSignature
                ? { opacity: 0.7, height: 50, transition: 'opacity .75s .15s ease, height .3s ease' }
                : { opacity: 0, height: 0, transition: 'opacity .3s ease, height .3s .1s ease' }
            }
            height={30}
            width={100}
            alt="Signature of Christian Anagnostou"
          />
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
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
`

const Signature = styled(Image)`
  display: block;
  margin-left: auto;
  margin-top: -1rem;
  pointer-events: none;
  user-select: none;
  transform-origin: center center;
  transform: translateY(0.5rem) scale(0.9);
`

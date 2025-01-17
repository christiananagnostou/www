import { motion } from 'framer-motion'
import Head from 'next/head'
import { GetStaticProps } from 'next/types'
import { useState } from 'react'
import styled from 'styled-components'
import { pageAnimation } from '../components/animation'
import Bio from '../components/Home/Bio'
import FeaturedProjects from '../components/Home/FeaturedProjects'
import MiddleRow from '../components/Home/MiddleRow'
import Signature from '../components/Home/Signature'
import StravaActivities from '../components/Home/StravaActivities'
import TVBar from '../components/Home/TVBar'
import LabLink from '../components/Lab/LabLink'
import SocialLinks from '../components/SocialLinks'
import { ArticleType, getAllPosts } from '../lib/articles'
import { getStravaActivities, StravaActivity } from '../lib/strava'

type Props = {
  posts: ArticleType[]
  stravaActivities: StravaActivity[]
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  const stravaActivities = await getStravaActivities()

  return {
    props: { posts, stravaActivities },
    revalidate: 60 * 60 * 24 /* 24 hours */,
  }
}

const Home = ({ posts, stravaActivities }: Props) => {
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
          <Bio />

          <MiddleRow posts={posts} />

          <StravaActivities activities={stravaActivities} />

          <FlexWrap>
            <FeaturedProjects />
            <SocialLinks />
          </FlexWrap>

          <FlexWrap style={revealBarStyle}>
            <LabLink />
            <Signature />
          </FlexWrap>

          <TVBar onBarFilled={setShowRevealBar} />
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
    padding: 1rem 1rem 1.5rem;
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

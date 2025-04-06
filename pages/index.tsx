import { motion } from 'framer-motion'
import Head from 'next/head'
import { GetStaticProps } from 'next/types'
import { useState } from 'react'
import styled from 'styled-components'
import { pageAnimation } from '../components/animation'
import Bio from '../components/Home/Bio'
import FeaturedProjects from '../components/Home/FeaturedProjects'
import StravaActivities from '../components/Home/StravaActivities'
import SocialLinks from '../components/SocialLinks'
import { ArticleType, getAllPosts } from '../lib/articles'
import { BASE_URL } from '../lib/constants'
import { getHomeStructuredData } from '../lib/structured/home'
import { type StravaActivity, getStravaActivities, refreshAccessToken } from '../lib/strava'
import RecentArt from '../components/Home/RecentArt'
import RecentArticles from '../components/Home/RecentArticles'

type Props = {
  posts: ArticleType[]
  stravaActivities: StravaActivity[]
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  await refreshAccessToken()
  const stravaActivities = await getStravaActivities()

  return {
    props: { posts, stravaActivities },
    revalidate: 60 * 60 * 12, // 12 hours
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
        <link rel="canonical" href={BASE_URL} />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="software engineer, web developer, programmer, portfolio, articles, art, projects, Strava, Christian Anagnostou"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Christian Anagnostou" />
        <meta property="og:description" content="Christian Anagnostou's Web Portfolio" />
        <meta property="og:url" content={BASE_URL} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Christian Anagnostou" />
        <meta name="twitter:description" content="Christian Anagnostou's Web Portfolio" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeStructuredData(posts)) }}
        />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <div className="page-inner-container">
          <Bio />

          <MiddleSection>
            <RecentArt />
            <RecentArticles posts={posts} />
          </MiddleSection>

          <StravaActivities activities={stravaActivities} />

          <FlexWrap>
            <FeaturedProjects />
            <SocialLinks />
          </FlexWrap>

          {/* <FlexWrap>
            <LabLink />
            <Signature />
          </FlexWrap> */}

          {/* <TVBar onBarFilled={setShowRevealBar} /> */}
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
    /* border: 1px solid var(--accent); */
    /* background: var(--body-bg); */
    /* padding: 1rem 1rem 1.5rem; */
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

const MiddleSection = styled.section`
  display: flex;
  width: 100%;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

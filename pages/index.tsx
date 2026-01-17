import { motion } from 'framer-motion'
import Head from 'next/head'
import type { GetStaticProps } from 'next/types'
import styled from 'styled-components'

import { pageAnimation } from '../components/animation'
import Bio from '../components/Home/Bio'
import FeaturedProjects from '../components/Home/FeaturedProjects'
import RecentArt from '../components/Home/RecentArt'
import RecentArticles from '../components/Home/RecentArticles'
import StravaActivities from '../components/Home/StravaActivities'
import SocialLinks from '../components/SocialLinks'
import type { ArticleType } from '../lib/articles'
import { getAllPosts } from '../lib/articles'
import { BASE_URL } from '../lib/constants'
import { type StravaActivity, getStravaActivities, refreshAccessToken } from '../lib/strava'
import { getHomeStructuredData } from '../lib/structured/home'

interface Props {
  posts: ArticleType[]
  stravaActivities: StravaActivity[]
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  await refreshAccessToken()
  const allStravaActivities = await getStravaActivities()
  const filteredActivities = allStravaActivities.filter((activity) =>
    ['Run', 'Ride', 'VirtualRide', 'Zwift', 'Swim'].includes(activity.type)
  )

  return {
    props: { posts, stravaActivities: filteredActivities },
    revalidate: 60 * 60 * 12, // 12 hours
  }
}

const Home = ({ posts, stravaActivities }: Props) => {
  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta content="Christian Anagnostou's Web Portfolio" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={BASE_URL} rel="canonical" />
        <meta content="index, follow" name="robots" />
        <meta
          content="software engineer, web developer, programmer, portfolio, articles, art, projects, Strava, Christian Anagnostou"
          name="keywords"
        />

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content="Christian Anagnostou" property="og:title" />
        <meta content="Christian Anagnostou's Web Portfolio" property="og:description" />
        <meta content={BASE_URL} property="og:url" />

        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Christian Anagnostou" name="twitter:title" />
        <meta content="Christian Anagnostou's Web Portfolio" name="twitter:description" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeStructuredData(posts)) }}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
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

const Container = styled(motion.div)`
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

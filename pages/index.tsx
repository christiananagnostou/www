import * as m from 'framer-motion/m'
import Head from 'next/head'
import type { GetStaticProps } from 'next/types'
import styled from 'styled-components'

import { pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import Bio from '../components/Home/Bio'
import GlyphGrove from '../components/Home/grove/GlyphGrove'
import LinkLedger from '../components/Home/LinkLedger'
import RecentArt from '../components/Home/RecentArt'
import RecentArticles from '../components/Home/RecentArticles'
import FitnessActivities from '../components/Home/FitnessActivities'
import { SITE_ORIGIN } from '../lib/constants'
import { getHomeContent, HOME_REVALIDATE_SECONDS } from '../lib/home/content'
import { getHomeStructuredData } from '../lib/structured/home'

type Props = Awaited<ReturnType<typeof getHomeContent>>

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: await getHomeContent(),
  revalidate: HOME_REVALIDATE_SECONDS,
})

const shareImage = `${SITE_ORIGIN}/A-square.png`

const Home = ({ posts, fitnessActivities }: Props) => {
  const pageTransitionInitial = usePageTransitionInitial()

  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta content="Christian Anagnostou's Web Portfolio" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={SITE_ORIGIN} rel="canonical" />
        <link href="/index.md" rel="alternate" type="text/markdown" />
        <meta content="index, follow" name="robots" />
        <meta
          content="software engineer, web developer, programmer, portfolio, articles, art, projects, fitness, Christian Anagnostou"
          name="keywords"
        />

        {/* Open Graph */}
        <meta key="og:type" content="website" property="og:type" />
        <meta key="og:title" content="Christian Anagnostou" property="og:title" />
        <meta key="og:description" content="Christian Anagnostou's Web Portfolio" property="og:description" />
        <meta key="og:url" content={SITE_ORIGIN} property="og:url" />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:alt" content="Christian Anagnostou’s monogram" />

        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="Christian Anagnostou" name="twitter:title" />
        <meta content="Christian Anagnostou's Web Portfolio" name="twitter:description" />
        <meta content={shareImage} name="twitter:image" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeStructuredData(posts)) }}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial={pageTransitionInitial} variants={pageAnimation}>
        <GlyphGrove />
        <div className="page-inner-container">
          <Bio />

          <MiddleSection>
            <RecentArt />
            <RecentArticles posts={posts} />
          </MiddleSection>

          <FitnessActivities activities={fitnessActivities.recent} totalCounts={fitnessActivities.totalCounts} />

          <LinkLedger />

          {/* <TVBar onBarFilled={setShowRevealBar} /> */}
        </div>
      </Container>
    </>
  )
}

export default Home

const Container = styled(m.div)`
  --grove-opening: clamp(3.5rem, 7.5vh, 5.5rem);
  --home-panel: color-mix(in srgb, var(--dark-bg) 92%, transparent);
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - var(--nav-height));

  .page-inner-container {
    max-width: var(--max-w-screen);
    margin: auto;
    padding: var(--grove-opening) 1rem clamp(2rem, 5vh, 4rem);
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 1rem;
    border-radius: 14px;
    position: relative;
  }

  /* With little room for side margins, frame the column with sky and trail instead. */
  @media (width <= 960px) {
    --grove-opening: clamp(5rem, 12vh, 8rem);
    .page-inner-container {
      padding-bottom: clamp(4rem, 9vh, 7rem);
    }
  }
`

const MiddleSection = styled.section`
  display: flex;
  width: 100%;
  gap: 1rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

import * as m from 'framer-motion/m'
import Head from 'next/head'
import type { GetStaticProps } from 'next/types'

import { pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import Bio from '../components/Home/Bio'
import LinkLedger from '../components/Home/LinkLedger'
import RecentArt from '../components/Home/RecentArt'
import RecentArticles from '../components/Home/RecentArticles'
import FitnessActivities from '../components/Home/FitnessActivities'
import { SITE_ORIGIN } from '../lib/constants'
import { getHomeContent, HOME_REVALIDATE_SECONDS } from '../lib/home/content'
import { getHomeStructuredData } from '../lib/structured/home'

import styles from '../styles/pages/Home.module.css'

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

      <m.div
        className={styles.container}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <div className={styles.pageInnerContainer}>
          <Bio />

          <section className={styles.middleSection}>
            <RecentArt />
            <RecentArticles posts={posts} />
          </section>

          <FitnessActivities activities={fitnessActivities.recent} totalCounts={fitnessActivities.totalCounts} />

          <LinkLedger />

          {/* <TVBar onBarFilled={setShowRevealBar} /> */}
        </div>
      </m.div>
    </>
  )
}

export default Home

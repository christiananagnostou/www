import * as m from 'framer-motion/m'
import Head from 'next/head'

import { fade, pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'
import Gantt from '../components/Lab/gantt'
import ganttProps from '../components/Lab/gantt/mockProps'
import Speedometer from '../components/Lab/speedometer/Speedometer'
import { Heading } from '../components/Shared/Heading'
import { SITE_ORIGIN } from '../lib/constants'

import styles from '../styles/pages/Lab.module.css'

export default function lab() {
  const pageTransitionInitial = usePageTransitionInitial()

  return (
    <>
      <Head>
        <title>Lab</title>
        <link rel="canonical" href={`${SITE_ORIGIN}/lab`} />
        <meta content="Christian Anagnostou's Laboratory" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <m.div
        className={styles.container}
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        variants={pageAnimation}
      >
        <Heading variants={fade}>
          <h1>Lab</h1>
          <p>
            My playground for UI experiments — where ideas take shape, break apart, and come together again in
            unexpected ways. My custom-built components are crafted carefully for performance and polish. Some are
            inspired by professional projects, others by in-the-moment curiosity.
          </p>
        </Heading>

        <m.div className={styles.labItems}>
          {/* Throttle */}
          <m.div className={styles.item} variants={fade}>
            <div className={styles.dateStyle}>Apr 2025</div>
            <div className={styles.inner}>
              <Speedometer />
            </div>
          </m.div>

          {/* Gantt */}
          <m.div className={styles.item} variants={fade}>
            <div className={styles.dateStyle}>May 2024</div>
            <div className={styles.inner}>
              <Gantt chartTitle={ganttProps.chartTitle} defaultZoom={ganttProps.defaultZoom} items={ganttProps.items} />
            </div>
          </m.div>

          {/* Calendar */}
          <m.div className={styles.item} variants={fade}>
            <div className={styles.dateStyle}>Apr 2024</div>
            <div className={styles.inner}>
              <DailyCalendar />
            </div>
          </m.div>
        </m.div>
      </m.div>
    </>
  )
}

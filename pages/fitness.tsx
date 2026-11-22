import * as m from 'framer-motion/m'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useMemo, useState } from 'react'

import { fade, pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import DisciplineLog from '../components/Fitness/DisciplineLog'
import styles from '../components/Fitness/Fitness.module.css'
import TrainingVolume from '../components/Fitness/TrainingVolume'
import { Heading } from '../components/Shared/Heading'
import { BASE_URL } from '../lib/constants'
import { getActivitiesSince } from '../lib/fitness/server/activityRepository'
import { toTrainingEntry, trainingDates } from '../lib/fitness/server/trainingEntries'
import { PERIODS, trainingLog, type Period, type TrainingEntry } from '../lib/fitness/training'

type Props = { entries: TrainingEntry[]; endDay: string; error?: string }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { endDay, since } = trainingDates()
  try {
    const activities = await getActivitiesSince(since)
    return { props: { entries: activities.map(toTrainingEntry), endDay }, revalidate: 60 * 60 * 12 }
  } catch (error) {
    console.error('Failed to load fitness activities', error instanceof Error ? error.message : 'Unknown error')
    return {
      props: { entries: [], endDay, error: 'The training log is unavailable right now. Please try again later.' },
      revalidate: 60 * 30,
    }
  }
}

export default function Fitness({ entries, endDay, error }: Props) {
  const initial = usePageTransitionInitial()
  const [period, setPeriod] = useState<Period>('12m')
  const log = useMemo(() => trainingLog(entries, endDay, period), [entries, endDay, period])
  return (
    <>
      <Head>
        <title>Fitness | Christian Anagnostou</title>
        <meta
          name="description"
          content="Christian Anagnostou’s triathlon training log. Explore swim, bike, and run volume, pace, and training time."
        />
        <link rel="canonical" href={`${BASE_URL}/fitness`} />
      </Head>
      <m.div className={styles.page} initial={initial} animate="show" exit="exit" variants={pageAnimation}>
        <Heading variants={fade} className={styles.heading}>
          <h1>Fitness</h1>
          <p>A log of my swims, rides, runs, and the days in between.</p>
          {!error && (
            <div className={styles.periods} role="group" aria-label="Training period">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={p === period}
                  aria-label={p === '1w' ? '1 week' : `${parseInt(p, 10)} ${p === '1m' ? 'month' : 'months'}`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </Heading>
        {error || !log.total.sessions ? (
          <m.div className={styles.empty} variants={fade} role="status">
            <h2>{error ? 'Training log unavailable' : 'No sessions in this period'}</h2>
            <p>
              {error ??
                (entries.length
                  ? 'Choose a longer period to see earlier training.'
                  : 'There are no recorded activities yet.')}
            </p>
          </m.div>
        ) : (
          <>
            <m.div variants={fade}>
              <TrainingVolume log={log} />
            </m.div>
            <m.div variants={fade}>
              <DisciplineLog log={log} />
            </m.div>
          </>
        )}
      </m.div>
    </>
  )
}

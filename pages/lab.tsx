import * as m from 'framer-motion/m'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'
import Gantt from '../components/Lab/gantt'
import ganttProps from '../components/Lab/gantt/mockProps'
import Speedometer from '../components/Lab/speedometer/Speedometer'
import { Heading } from '../components/Shared/Heading'
import { fetchSchedule, fetchTeams } from '../lib/mlb/api'
import type { ScheduleGame, TeamInfo } from '../lib/mlb/types'
import { resolveTeamId } from '../lib/mlb/utils'

const MLBScoreboard = dynamic(() => import('../components/Lab/scoreboard/MLBScoreboard'))
const DEFAULT_TEAM = 'SF'

interface LabProps {
  initialGames: ScheduleGame[]
  initialTeams: TeamInfo[]
  hasInitialSchedule: boolean
}

export default function Lab({
  initialGames,
  initialTeams,
  hasInitialSchedule,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const pageTransitionInitial = usePageTransitionInitial()

  return (
    <>
      <Head>
        <title>Lab</title>
        <meta content="Christian Anagnostou's Laboratory" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Container animate="show" exit="exit" initial={pageTransitionInitial} variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Lab</h1>
          <p>
            My playground for UI experiments — where ideas take shape, break apart, and come together again in
            unexpected ways. My custom-built components are crafted carefully for performance and polish. Some are
            inspired by professional projects, others by in-the-moment curiosity.
          </p>
        </Heading>

        <LabItems>
          <LabItem title="MLB Scoreboard" date="May 2025">
            <MLBScoreboard
              defaultTeam={DEFAULT_TEAM}
              initialGames={initialGames}
              initialTeams={initialTeams}
              hasInitialSchedule={hasInitialSchedule}
            />
          </LabItem>

          <LabItem title="Speedometer" date="Apr 2025">
            <Speedometer />
          </LabItem>

          <LabItem title="Gantt Chart" date="May 2024">
            <Gantt chartTitle={ganttProps.chartTitle} defaultZoom={ganttProps.defaultZoom} items={ganttProps.items} />
          </LabItem>

          <LabItem title="Calendar" date="Apr 2024">
            <DailyCalendar />
          </LabItem>
        </LabItems>
      </Container>
    </>
  )
}

function LabItem({ title, date, children }: { title: string; date: string; children: ReactNode }) {
  return (
    <Item variants={fade}>
      <ItemHeader>
        <span>{title}</span>
        <time>{date}</time>
      </ItemHeader>
      <Inner>{children}</Inner>
    </Item>
  )
}

export const getStaticProps: GetStaticProps<LabProps> = async () => {
  try {
    const initialTeams = await fetchTeams()
    const defaultTeamId = resolveTeamId(DEFAULT_TEAM, initialTeams)
    const initialGames = defaultTeamId ? await fetchSchedule(defaultTeamId) : []

    return {
      props: { initialGames, initialTeams, hasInitialSchedule: defaultTeamId !== null },
      revalidate: 300,
    }
  } catch (error) {
    console.error('Unable to pre-render the MLB scoreboard', error)
    return {
      props: { initialGames: [], initialTeams: [], hasInitialSchedule: false },
      revalidate: 60,
    }
  }
}

const Container = styled(m.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;

  @media (width <= 768px) {
    padding: 2rem 1rem 4rem;
  }
`

const LabItems = styled(m.div)`
  display: flex;
  flex-direction: column;
  gap: 4rem;

  @media (width <= 768px) {
    gap: 2rem;
  }
`

const Item = styled(m.div)`
  width: 100%;
  max-width: var(--max-w-screen);
`

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-dark);
  font-size: 0.9rem;
  gap: 0.5rem;

  @media (width <= 768px) {
    padding-right: 1rem;
  }
`

const Inner = styled.div`
  padding: 4rem;
  background: var(--dark-bg);
  border-radius: var(--border-radius-lg);

  @media (width <= 768px) {
    padding: 1rem;
  }
`

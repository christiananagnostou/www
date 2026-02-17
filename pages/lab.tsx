import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'
import Gantt from '../components/Lab/gantt'
import ganttProps from '../components/Lab/gantt/mockProps'
import MLBScoreboard from '../components/Lab/scoreboard/MLBScoreboard'
import type { ScheduleGame } from '../components/Lab/scoreboard/types'
import Speedometer from '../components/Lab/speedometer/Speedometer'
import { Heading } from '../components/Shared/Heading'

export default function lab({ initialGames }: { initialGames: ScheduleGame[] }) {
  return (
    <>
      <Head>
        <title>Lab</title>
        <meta content="Christian Anagnostou's Laboratory" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Lab</h1>
          <p>
            My playground for UI experiments — where ideas take shape, break apart, and come together again in
            unexpected ways. My custom-built components are crafted carefully for performance and polish. Some are
            inspired by professional projects, others by in-the-moment curiosity.
          </p>
        </Heading>

        <LabItems>
          <Item variants={fade}>
            <ItemHeader>
              <HeaderText>MLB Scoreboard</HeaderText>
              <HeaderText>May 2025</HeaderText>
            </ItemHeader>
            <Inner>
              <MLBScoreboard defaultTeam="SF" initialGames={initialGames} />
            </Inner>
          </Item>

          <Item variants={fade}>
            <ItemHeader>
              <HeaderText>Speedometer</HeaderText>
              <HeaderText>Apr 2025</HeaderText>
            </ItemHeader>
            <Inner>
              <Speedometer />
            </Inner>
          </Item>

          <Item variants={fade}>
            <ItemHeader>
              <HeaderText>Gantt Chart</HeaderText>
              <HeaderText>May 2024</HeaderText>
            </ItemHeader>
            <Inner>
              <Gantt chartTitle={ganttProps.chartTitle} defaultZoom={ganttProps.defaultZoom} items={ganttProps.items} />
            </Inner>
          </Item>

          <Item variants={fade}>
            <ItemHeader>
              <HeaderText>Calendar</HeaderText>
              <HeaderText>Apr 2024</HeaderText>
            </ItemHeader>
            <Inner>
              <DailyCalendar />
            </Inner>
          </Item>
        </LabItems>
      </Container>
    </>
  )
}

export async function getServerSideProps() {
  // Import the helpers dynamically so that they run server-side only.
  const { fetchTeams, fetchSchedule } = await import('../components/Lab/scoreboard/utils')
  const teams = await fetchTeams()
  // Giants should always be used (teamCode "SF")
  const giants = teams.find((t) => t.teamCode === 'SF')
  let initialGames: ScheduleGame[] = []
  if (giants) initialGames = await fetchSchedule(giants.id)
  return { props: { initialGames } }
}

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;

  @media (width <= 768px) {
    padding: 2rem 1rem 4rem;
  }
`

const LabItems = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4rem;

  @media (width <= 768px) {
    gap: 2rem;
  }
`

const Item = styled(motion.div)`
  width: 100%;
  max-width: var(--max-w-screen);
`

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;
`

const HeaderText = styled.div`
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 1rem;

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

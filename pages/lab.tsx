import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'
import Gantt from '../components/Lab/gantt'
import ganttProps from '../components/Lab/gantt/mockProps'
import Speedometer from '../components/Lab/speedometer/Speedometer'
import { Heading } from '../components/Shared/Heading'

export default function lab() {
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
          {/* Throttle */}
          <Item variants={fade}>
            <DateStyle>Apr 2025</DateStyle>
            <Inner>
              <Speedometer />
            </Inner>
          </Item>

          {/* Gantt */}
          <Item variants={fade}>
            <DateStyle>May 2024</DateStyle>
            <Inner>
              <Gantt chartTitle={ganttProps.chartTitle} defaultZoom={ganttProps.defaultZoom} items={ganttProps.items} />
            </Inner>
          </Item>

          {/* Calendar */}
          <Item variants={fade}>
            <DateStyle>Apr 2024</DateStyle>
            <Inner>
              <DailyCalendar />
            </Inner>
          </Item>
        </LabItems>
      </Container>
    </>
  )
}

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem 4rem;
  }
`

const LabItems = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`

const Item = styled(motion.div)`
  width: 100%;
  max-width: var(--max-w-screen);
`

const DateStyle = styled.div`
  width: 100%;
  text-align: right;
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding-right: 1rem;
  }
`

const Inner = styled.div`
  padding: 4rem;
  background: var(--dark-bg);
  border-radius: 10px;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'
import Gantt from '../components/Lab/gantt'
import ganttProps from '../components/Lab/gantt/mockProps'

export default function lab() {
  return (
    <>
      <Head>
        <title>Lab</title>
        <meta name="description" content="Christian Anagnostou's Laboratory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LabItems variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        {/* Gantt */}
        <Item variants={fade}>
          <DateStyle>May 2024</DateStyle>
          <Inner>
            <Gantt items={ganttProps.items} defaultZoom={ganttProps.defaultZoom} chartTitle={ganttProps.chartTitle} />
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
    </>
  )
}

const LabItems = styled(motion.div)`
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 2rem 1rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
    padding: 2rem 0.5rem 4rem;
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

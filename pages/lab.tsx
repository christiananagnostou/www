import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import DailyCalendar from '../components/Lab/calendar/DailyCalendar'

export default function lab() {
  return (
    <>
      <Head>
        <title>Lab</title>
        <meta name="description" content="Christian Anagnostou's Laboratory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <LabItems id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        {/* Calendar */}
        <DateStyle>Apr 2024</DateStyle>
        <Item variants={fade}>
          <DailyCalendar />
        </Item>
      </LabItems>
    </>
  )
}

const LabItems = styled(motion.div)`
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    gap: 0.5rem;
  }
`

const Item = styled(motion.div)`
  width: 100%;
  padding: 4rem;
  background: var(--bg);
  flex: 1;
  display: grid;
  place-items: center;
  border-radius: 10px;
  flex: 1;
  overflow: hidden;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 3rem;
  }
`

const DateStyle = styled.div`
  width: 100%;
  text-align: right;
  color: var(--text-dark);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding-right: 1rem;
  }
`

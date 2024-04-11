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
        <Item variants={fade}>
          <DailyCalendar date={new Date().toString()} />
        </Item>
      </LabItems>
    </>
  )
}

const LabItems = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const Item = styled(motion.div)`
  border: 1px solid var(--accent);
  border-radius: 5px;
  max-width: calc(50% - 0.5rem);
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

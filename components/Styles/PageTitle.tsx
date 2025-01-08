import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade } from '../animation'

type Props = {
  titleLeft: string
  titleRight: string
}

const PageTitle = ({ titleLeft, titleRight }: Props) => {
  return (
    <Container variants={fade}>
      <span>{titleLeft}</span>
      <span className="bar"></span>
      <span>{titleRight}</span>
    </Container>
  )
}

export default PageTitle

const Container = styled(motion.h2)`
  margin-bottom: 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 768px) {
    margin-bottom: 3rem;
  }

  span {
    font-weight: 200;
    font-size: 0.9rem;
    color: var(--text);
  }

  .bar {
    height: 0;
    flex: 1;
    margin: 0 1rem;
    border-bottom: 1px solid var(--accent);
  }
`

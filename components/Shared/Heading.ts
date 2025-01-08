import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Heading = styled(motion.div)`
  margin-bottom: 2rem;

  h1 {
    font-size: 1.5rem;
    text-align: left;
    font-weight: 400;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`

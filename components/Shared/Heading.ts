import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Heading = styled(motion.div)`
  margin-bottom: 3.5rem;

  h1 {
    font-weight: normal;
    font-size: 1.25rem;
    text-align: left;
  }

  p {
    padding-top: 1.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`

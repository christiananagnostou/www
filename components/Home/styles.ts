import { motion } from 'framer-motion'
import { styled } from 'styled-components'

export const HomepageBox = styled(motion.div)`
  position: relative;
  flex: 1;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }

  .homepage-box__title {
    position: relative;
    z-index: 1;
    display: block;
    width: fit-content;
    margin-bottom: 1rem;
  }
`

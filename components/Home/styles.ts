import { motion } from 'framer-motion'
import { styled } from 'styled-components'

export const HomepageBox = styled(motion.div)`
  position: relative;
  flex: 1;
  border-radius: var(--border-radius-md);
  padding: 1rem;
  background: var(--dark-bg);
  border: 1px solid var(--accent);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }

  .homepage-box__title {
    display: block;
    margin-bottom: 1rem;
    width: fit-content;
    position: relative;
    z-index: 1;
  }
`

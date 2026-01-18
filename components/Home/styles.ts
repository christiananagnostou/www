import { motion } from 'framer-motion'
import { styled } from 'styled-components'

export const HomepageBox = styled(motion.div)`
  position: relative;
  flex: 1;
  border-radius: 7px;
  padding: 1rem;
  background: var(--dark-bg);
  border: 1px solid var(--accent);

  * {
    font-weight: 200;
    font-size: 0.95rem;
  }

`

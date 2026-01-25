import { motion } from 'framer-motion'
import styled from 'styled-components'

export const ButtonRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--accent);
  overflow: auto;

  button {
    min-width: max-content;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    background: var(--border);
    font-size: 0.85rem;
    color: var(--text);
    text-transform: capitalize;
    cursor: pointer;
    transition: all 0.25s ease;

    &.selected {
      background: var(--accent);
      color: #ffffff;
    }
  }
`

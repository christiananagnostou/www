import { motion } from 'framer-motion'
import styled from 'styled-components'

export const ButtonRow = styled(motion.div)`
  max-width: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--accent);
  margin-bottom: 1rem;

  button {
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
    border-radius: 5px;
    background: var(--border);
    border: 1px solid var(--accent);
    color: var(--text);
    cursor: pointer;
    transition: all 0.25s ease;
    text-transform: capitalize;
    min-width: max-content;

    &.selected {
      color: white;
      background: var(--accent);
    }
  }
`

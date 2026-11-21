import * as m from 'framer-motion/m'
import styled from 'styled-components'
import { fade } from './animation'
import Github from './SVG/GitHub'
import LinkedIn from './SVG/LinkedIn'
import Twitter from './SVG/Twitter'

function SocialLinks({ showLabels = false }: { showLabels?: boolean }) {
  return (
    <SocialLinkList $labeled={showLabels} variants={fade}>
      <li>
        <a aria-label="GitHub" href="https://github.com/ChristianAnagnostou" rel="noreferrer" target="_blank">
          <Github />
          {showLabels && 'GitHub'}
        </a>
      </li>
      <li>
        <a aria-label="LinkedIn" href="https://linkedin.com/in/ChristianAnagnostou/" rel="noreferrer" target="_blank">
          <LinkedIn />
          {showLabels && 'LinkedIn'}
        </a>
      </li>
      <li>
        <a aria-label="X" href="https://x.com/javascramble" rel="noreferrer" target="_blank">
          <Twitter />
          {showLabels && 'X'}
        </a>
      </li>
    </SocialLinkList>
  )
}

const SocialLinkList = styled(m.ul)<{ $labeled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  height: fit-content;
  margin: 0;
  padding: 0.05rem 0.75rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-sm);
  background: var(--dark-bg);
  list-style: none;

  li {
    flex: 1;

    a {
      display: block;
      padding: 0.5rem 0.25rem;
      color: var(--text-dark);
      cursor: alias;
      transition: color 0.3s ease;

      &:hover {
        color: var(--text);
      }

      * {
        display: block;
      }
    }
  }

  ${({ $labeled }) =>
    $labeled &&
    `
    display: grid;
    width: 100%;
    gap: 0;
    padding: 0;
    border: none;
    background: none;
    li a {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.4rem;
      min-height: 2.75rem;
      padding: 0;
      text-align: right;
      font-size: 0.95rem;
      cursor: pointer;
    }
  `}
`

export default SocialLinks

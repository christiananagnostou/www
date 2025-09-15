import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade } from './animation'
import Github from './SVG/GitHub'
import LinkedIn from './SVG/LinkedIn'
import Readcv from './SVG/Readcv'
import Twitter from './SVG/Twitter'

function SocialLinks() {
  return (
    <SocialLinkList variants={fade}>
      <li>
        <a aria-label="GitHub" href="https://github.com/ChristianAnagnostou" rel="noreferrer" target="_blank">
          <Github />
        </a>
      </li>
      <li>
        <a aria-label="LinkedIn" href="https://linkedin.com/in/ChristianAnagnostou/" rel="noreferrer" target="_blank">
          <LinkedIn />
        </a>
      </li>
      <li>
        <a aria-label="Read my CV" href="https://read.cv/christian.a" rel="noreferrer" target="_blank">
          <Readcv />
        </a>
      </li>
      <li>
        <a aria-label="X" href="https://x.com/javascramble" rel="noreferrer" target="_blank">
          <Twitter />
        </a>
      </li>
    </SocialLinkList>
  )
}

const SocialLinkList = styled(motion.ul)`
  width: fit-content;
  margin: 0;
  display: flex;
  gap: 0.75rem;
  padding: 0.05rem 0.75rem;
  justify-content: center;
  align-items: center;
  list-style: none;
  height: fit-content;

  border-radius: var(--border-radius-sm);
  background: var(--dark-bg);
  border: 1px solid var(--accent);

  li {
    flex: 1;

    a {
      padding: 0.5rem 0.25rem;
      display: block;
      cursor: alias;
      color: var(--text-dark);
      transition: color 0.3s ease;

      &:hover {
        color: var(--text);
      }

      * {
        display: block;
      }
    }
  }
`

export default SocialLinks

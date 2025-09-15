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
        <a href="https://github.com/ChristianAnagnostou" target="_blank" rel="noreferrer" aria-label="GitHub">
          <Github />
        </a>
      </li>
      <li>
        <a href="https://linkedin.com/in/ChristianAnagnostou/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedIn />
        </a>
      </li>
      <li>
        <a href="https://read.cv/christian.a" target="_blank" rel="noreferrer" aria-label="Read my CV">
          <Readcv />
        </a>
      </li>
      <li>
        <a href="https://x.com/javascramble" target="_blank" rel="noreferrer" aria-label="X">
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

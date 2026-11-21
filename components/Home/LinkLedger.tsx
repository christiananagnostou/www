import * as m from 'framer-motion/m'
import styled from 'styled-components'

import { staggerFade } from '../animation'
import SocialLinks from '../SocialLinks'
import FeaturedProjects from './FeaturedProjects'

export default function LinkLedger() {
  return (
    <Ledger id="link-ledger" variants={staggerFade}>
      <FeaturedProjects />
      <Profiles aria-label="Social profiles">
        <SocialLinks unboxed />
      </Profiles>
    </Ledger>
  )
}

const Ledger = styled(m.footer)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-self: center;
  width: fit-content;
  max-width: 100%;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);
  a:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: -2px;
  }
  @media (width < 390px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Profiles = styled.nav`
  display: grid;
  place-items: center;
  padding: 0 0.5rem;
  border-left: 1px solid var(--accent);
  @media (width <= 480px) {
    padding: 0;
  }
  @media (width < 390px) {
    border-left: 0;
    border-top: 1px solid var(--accent);
  }
`

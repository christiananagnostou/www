import styled from 'styled-components'

import SocialLinks from '../SocialLinks'
import FeaturedProjects from './FeaturedProjects'

export default function LinkLedger() {
  return (
    <Ledger id="link-ledger">
      <FeaturedProjects />
      <Profiles aria-label="Social profiles">
        <SocialLinks unboxed />
      </Profiles>
    </Ledger>
  )
}

const Ledger = styled.footer`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  width: 100%;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);
  a:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: -2px;
  }
`

const Profiles = styled.nav`
  display: grid;
  place-items: center;
  padding: 0 0.5rem;
  border-left: 1px solid var(--accent);
  ul {
    flex-direction: column;
  }
`

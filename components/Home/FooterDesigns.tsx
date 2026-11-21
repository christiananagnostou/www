import { useEffect, useState } from 'react'
import styled from 'styled-components'

import SocialLinks from '../SocialLinks'
import FeaturedProjects from './FeaturedProjects'

const designs = ['Split panels', 'Single shelf', 'Ledger', 'Gallery', 'Spotlight'] as const

export default function FooterDesigns({ compare }: { compare: boolean }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!compare) return
    const choice = Number(new URLSearchParams(window.location.search).get('footer'))
    if (Number.isInteger(choice) && choice >= 1 && choice <= designs.length) setIndex(choice - 1)
  }, [compare])

  function select(next: number) {
    setIndex(next)
    const url = new URL(window.location.href)
    url.searchParams.set('footer', String(next + 1))
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <Section id="footer-designs">
      {compare && (
        <Picker aria-label="Compare footer designs" role="group">
          {designs.map((name, i) => (
            <button key={name} type="button" aria-pressed={i === index} onClick={() => select(i)}>
              {i + 1}. {name}
            </button>
          ))}
        </Picker>
      )}
      <Footer data-design={designs[index]}>
        <FeaturedProjects />
        <nav aria-label="Social profiles">
          <SocialLinks unboxed />
        </nav>
      </Footer>
    </Section>
  )
}

const Section = styled.div`
  width: 100%;
  min-width: 0;
  scroll-margin-top: 4rem;
`

const Picker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  button {
    border: 1px solid transparent;
    border-radius: var(--border-radius-sm);
    background: none;
    color: var(--text-dark);
    min-height: 2rem;
    padding: 0.25rem 0.55rem;
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
  }
  button[aria-pressed='true'] {
    background: var(--heading);
    color: var(--dark-bg);
  }
  button:focus-visible,
  button:hover {
    border-color: var(--text-dark);
  }
`

const Footer = styled.footer`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;
  nav {
    min-width: 0;
  }
  :where(nav:first-child) a {
    color: var(--heading);
  }
  nav:last-child {
    display: grid;
    place-items: center;
  }
  a:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: -2px;
  }

  &[data-design='Split panels'] nav,
  &[data-design='Single shelf'],
  &[data-design='Ledger'],
  &[data-design='Gallery'],
  &[data-design='Spotlight'] nav {
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-md);
    background: var(--dark-bg);
  }
  &[data-design='Split panels'] nav {
    padding: 0.25rem 0.65rem;
  }
  &[data-design='Split panels'] nav:first-child {
    justify-content: space-around;
  }

  &[data-design='Single shelf'] {
    align-items: center;
    padding: 0.35rem 0.75rem;
    nav:first-child {
      gap: 0 1.25rem;
    }
    nav:last-child {
      padding-left: 0.65rem;
      border-left: 1px solid var(--accent);
    }
  }

  &[data-design='Ledger'] {
    gap: 0;
    nav:first-child {
      display: grid;
      padding: 0 1rem;
    }
    :where(nav:first-child a) + a {
      border-top: 1px solid var(--accent);
    }
    nav:last-child {
      border-left: 1px solid var(--accent);
      padding: 0 0.5rem;
    }
    ul {
      flex-direction: column;
    }
  }

  &[data-design='Gallery'] {
    grid-template-columns: 1fr;
    gap: 0;
    nav:first-child {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0;
    }
    nav:first-child a {
      flex-direction: column;
      justify-content: center;
      min-height: 5.75rem;
      gap: 0.6rem;
    }
    nav:first-child a + a {
      border-left: 1px solid var(--accent);
    }
    nav:first-child :is(img, svg) {
      width: 1.5rem;
      height: 1.5rem;
    }
    nav:last-child {
      border-top: 1px solid var(--accent);
    }
  }

  &[data-design='Spotlight'] {
    nav:first-child {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      padding: 0.5rem 1rem;
    }
    nav:first-child a:first-child {
      grid-row: span 2;
      flex-direction: column;
      justify-content: center;
      border-right: 1px solid var(--accent);
      margin-right: 1rem;
    }
    nav:first-child a:first-child svg {
      width: 2rem;
      height: 2rem;
    }
    nav:last-child {
      padding: 0 0.25rem;
    }
    ul {
      flex-direction: column;
    }
  }

  @media (max-width: 600px) {
    &[data-design='Split panels'],
    &[data-design='Single shelf'] {
      grid-template-columns: 1fr;
    }
    &[data-design='Single shelf'] {
      gap: 0;
      nav:first-child {
        justify-content: center;
      }
      nav:last-child {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid var(--accent);
      }
    }
  }
`

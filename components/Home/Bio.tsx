import * as m from 'framer-motion/m'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'
import Giants from '../SVG/Giants'

function Bio() {
  return (
    <Description className="max-w-screen" variants={staggerFade}>
      <m.h1 variants={fade}>Christian Anagnostou</m.h1>

      <m.p variants={fade}>
        I’m a lead software engineer at{' '}
        <a aria-label="Visit Vuori website" href="https://vuoriclothing.com/" rel="noreferrer" target="_blank">
          <em>Vuori</em>
        </a>
        . Away from the keyboard, I take photos and train for triathlons.
      </m.p>

      <m.p variants={fade}>
        I’m also a fan of the{' '}
        <GiantsSlotContainer animate="rest" initial="rest" whileHover="hover">
          <Slot>
            <TextSlot variants={textSlotVariants}>SF</TextSlot>
            <SVGSlot aria-hidden="true" variants={svgSlotVariants}>
              <Giants />
            </SVGSlot>
          </Slot>
          <span> Giants</span>
        </GiantsSlotContainer>{' '}
        — if baseball is your thing too, let’s catch a game.
      </m.p>
    </Description>
  )
}

export default Bio

const spring = { type: 'spring', stiffness: 300, damping: 20 } as const

const textSlotVariants = {
  rest: { y: 0, opacity: 1, transition: spring },
  hover: { y: '-100%', opacity: 0, transition: spring },
}

const svgSlotVariants = {
  rest: { y: '100%', opacity: 0, transition: spring },
  hover: { y: 0, opacity: 1, transition: spring },
}

const GiantsSlotContainer = styled(m.em)`
  position: relative;
`

// The slot container masks the overflowing text/SVG.
const Slot = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
`

// The "SF" text which animates upward on hover.
const TextSlot = styled(m.span)`
  position: relative;
  display: block;
`

// The SVG starts below and slides upward into view.
const SVGSlot = styled(m.span)`
  position: absolute;
  inset: 0;
  margin: auto;
  display: block;
  height: 70%;
  svg {
    height: 100%;
    width: 100%;
    color: #fd5a1e;
  }
`

const Description = styled(m.section)`
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-self: start;
  max-width: 37rem;
  padding: 1rem 0 1.5rem;
  text-align: left;

  em {
    font-weight: normal;
    font-family: 'Georgia', serif;
    letter-spacing: 0.03em;
  }

  h1 {
    margin: 0 0 1rem;
    font-weight: 500;
    font-size: 1.75rem;
  }

  hr {
    margin: 0 0 1rem;
    border: none;
    border-top: 1px solid var(--accent);
  }

  p {
    margin: 0 0 1rem;
    font-weight: normal;
    font-size: 0.95rem;
    line-height: 1.5rem;

    &:last-child {
      margin: 0;
    }
  }
`

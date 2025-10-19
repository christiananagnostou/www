import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'
import Giants from '../SVG/Giants'

function Bio() {
  return (
    <Description className="max-w-screen" variants={staggerFade}>
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Creating web experiences that <em>inspire</em>. Currently working as a senior software engineer at{' '}
        <a aria-label="Visit Vuori website" href="https://vuoriclothing.com/" rel="noreferrer" target="_blank">
          <em>Vuori</em>
        </a>
        .
      </motion.p>

      <motion.p variants={fade}>
        Among other things, I&apos;m a huge fan of the{' '}
        <GiantsSlotContainer animate="rest" initial="rest" whileHover="hover">
          <Slot>
            <TextSlot variants={textSlotVariants}>SF</TextSlot>
            <SVGSlot aria-hidden="true" variants={svgSlotVariants}>
              <Giants />
            </SVGSlot>
          </Slot>
          <span> Giants</span>
        </GiantsSlotContainer>{' '}
        and baseball in general. If baseball is your thing too, hit me up and maybe we can catch a game together.
      </motion.p>

      <motion.p variants={fade}>
        As for this site, it&apos;s a place where I can share my thoughts, projects, and experiences. No matter how you
        stumbled upon this site or what you&apos;re looking for, I hope you find something that resonates with you.
      </motion.p>
    </Description>
  )
}

export default Bio

const spring = { type: 'spring', stiffness: 300, damping: 20 } // Spring animation for slot transitions.

const textSlotVariants = {
  rest: { y: 0, opacity: 1, transition: spring },
  hover: { y: '-100%', opacity: 0, transition: spring },
}

const svgSlotVariants = {
  rest: { y: '100%', opacity: 0, transition: spring },
  hover: { y: 0, opacity: 1, transition: spring },
}

const GiantsSlotContainer = styled(motion.em)`
  position: relative;
`

// The slot container masks the overflowing text/SVG.
const Slot = styled.span`
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
`

// The "SF" text which animates upward on hover.
const TextSlot = styled(motion.span)`
  position: relative;
  display: block;
`

// The SVG starts below and slides upward into view.
const SVGSlot = styled(motion.span)`
  position: absolute;
  display: block;
  height: 70%;
  margin: auto;
  inset: 0;
  svg {
    width: 100%;
    height: 100%;
    color: #fd5a1e;
  }
`

const Description = styled(motion.section)`
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: auto;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);
  text-align: left;

  em {
    font-weight: normal;
    font-family: var(--font-serif);
    letter-spacing: 0.03em;
  }

  h1 {
    margin: 0 0 2rem;
    font-weight: 200;
    font-size: 1.1rem;
  }

  hr {
    margin: 0 0 1rem;
    border: none;
    border-top: 1px solid var(--accent);
  }

  p {
    margin: 0 0 1rem;
    font-weight: 200;
    font-size: 0.95rem;
    line-height: 1.5rem;

    &:last-child {
      margin: 0;
    }
  }
`

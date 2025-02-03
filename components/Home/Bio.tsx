import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'
import Giants from '../SVG/Giants'

function Bio() {
  return (
    <Description variants={staggerFade} className="max-w-screen">
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Creating web experiences that <em>inspire</em>. Currently working as a senior software engineer at{' '}
        <a href="https://vuoriclothing.com/" target="_blank" rel="noreferrer" aria-label="Visit Vuori website">
          <em>Vuori</em>
        </a>
        .
      </motion.p>

      <motion.p variants={fade}>
        Among other things, I&apos;m a huge fan of the{' '}
        <GiantsSlotContainer initial="rest" whileHover="hover" animate="rest">
          <Slot>
            <TextSlot variants={textSlotVariants}>SF</TextSlot>
            <SVGSlot variants={svgSlotVariants} aria-hidden="true">
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
  overflow: hidden;
  vertical-align: bottom;
`

// The "SF" text which animates upward on hover.
const TextSlot = styled(motion.span)`
  position: relative;
  display: block;
`

// The SVG starts below and slides upward into view.
const SVGSlot = styled(motion.span)`
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

const Description = styled(motion.section)`
  margin: auto;
  border-radius: 7px;
  padding: 1rem;
  background: var(--dark-bg);
  border: 1px solid var(--accent);
  text-align: left;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  em {
    font-family: var(--font-serif);
    font-weight: 400;
    letter-spacing: 0.03em;
  }

  h1 {
    font-size: 1.1rem;
    font-weight: 200;
    margin: 0 0 2rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--accent);
    margin: 0 0 1rem;
  }

  p {
    font-weight: 200;
    font-size: 0.95rem;
    line-height: 1.5rem;
    margin: 0 0 1rem;

    &:last-child {
      margin: 0;
    }
  }
`

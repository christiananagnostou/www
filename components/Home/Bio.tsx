import { m as motion, useReducedMotion } from 'framer-motion'
import styled from 'styled-components'
import { instant } from '../animation'
import { useMotionPresets } from '../animation/MotionPresetsProvider'
import Giants from '../SVG/Giants'

const spring = { type: 'spring', stiffness: 300, damping: 20 } as const

const hoverTextSlotVariants = {
  rest: { y: 0, opacity: 1, transition: spring },
  hover: { y: '-100%', opacity: 0, transition: spring },
}

const hoverSvgSlotVariants = {
  rest: { y: '100%', opacity: 0, transition: spring },
  hover: { y: 0, opacity: 1, transition: spring },
}

function Bio() {
  const { fade, staggerFade } = useMotionPresets()
  const prefersReducedMotion = useReducedMotion()
  const textSlotVariants = prefersReducedMotion ? { rest: instant.show, hover: instant.show } : hoverTextSlotVariants
  const svgSlotVariants = prefersReducedMotion ? { rest: instant.show, hover: instant.show } : hoverSvgSlotVariants

  return (
    <Description className="max-w-screen" variants={staggerFade}>
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Creating web experiences that <em>inspire</em>. Currently working as a lead software engineer at{' '}
        <a aria-label="Visit Vuori website" href="https://vuoriclothing.com/" rel="noreferrer" target="_blank">
          <em>Vuori</em>
        </a>
        .
      </motion.p>

      <motion.p variants={fade}>
        Among other things, I&apos;m a huge fan of the{' '}
        <GiantsSlotContainer animate="rest" initial="rest" whileHover={prefersReducedMotion ? undefined : 'hover'}>
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

const GiantsSlotContainer = styled(motion.em)`
  position: relative;
`

const Slot = styled.span`
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
`

const TextSlot = styled(motion.span)`
  position: relative;
  display: block;
`

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

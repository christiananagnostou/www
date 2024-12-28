import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'

function Bio() {
  return (
    <Description variants={staggerFade} className="max-w-screen">
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Creating elegant web experiences that inspire and always pursuing excellence. Currently working as a{' '}
        <em>senior software engineer</em> at{' '}
        <a href="https://vuoriclothing.com/" target="_blank" rel="noreferrer" aria-label="Visit Vuori website">
          <em>Vuori</em>
        </a>
        .
      </motion.p>

      <motion.p variants={fade}>
        This site showcases my work, articles, photos, and a few other things I find interesting, with hidden Easter
        eggs sprinkled throughout. If you find one, feel free to reach out - I&apos;d love to hear about it!
      </motion.p>
    </Description>
  )
}
export default Bio

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
    margin: 0 0 0.75rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--accent);
    margin: 0 0 0.5rem;
  }

  p {
    font-weight: 200;
    font-size: 0.95rem;
    line-height: 1.5rem;
    margin: 0 0 0.5rem;

    &:last-child {
      margin: 0;
    }
  }

  .giants-container {
    position: relative;
    padding-left: 11px;
    font-weight: 400;

    .giants {
      height: 14px;
      width: auto;
      position: absolute;
      left: 0.5px;
      top: 0px;

      @media screen and (min-width: 768px) {
        height: 15px;
      }

      svg {
        height: 100%;
        width: auto;
        transition: color 0.5s ease;
      }
    }

    &:hover svg {
      color: #fd5a1e;
    }
  }
`

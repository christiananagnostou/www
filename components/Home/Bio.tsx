import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'

function Bio() {
  return (
    <Description variants={staggerFade} className="max-w-screen">
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Striving to create an <em>elegant</em> web experience driven by constant pursuit of excellence.
      </motion.p>

      <motion.p variants={fade}>
        Currently working as a Senior Software Engineer at{' '}
        <a href="https://vuoriclothing.com/" target="_blank" rel="noreferrer" aria-label="Visit Vuori website">
          Vuori
        </a>
        .
      </motion.p>

      {/* <motion.hr variants={fade} />

      <motion.p variants={fade}>
        When I&apos;m not in front of my laptop, I&apos;m either out cycling, lifting, or at a{' '}
        <span className="giants-container">
          iants{' '}
          <span className="giants">
            <Giants />
          </span>
        </span>{' '}
        game. I also dabble with winemaking, photography, and writing.
      </motion.p> */}
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
  color: #cbcbcb;

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

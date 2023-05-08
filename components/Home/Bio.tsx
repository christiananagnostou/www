import { motion } from 'framer-motion'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'

function Bio() {
  return (
    <Description variants={staggerFade} className="max-w-screen">
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Studying the digital systems that shape our world and leaving a trail of <em>elegance</em> along the way.
      </motion.p>

      <motion.p variants={fade}>
        At{' '}
        <a href="https://www.electriqmarketing.com/" target={'_blank'} rel="noreferrer">
          <em>Electriq</em>
        </a>
        , I helped build their{' '}
        <a href="https://www.electriq.app/" target={'_blank'} rel="noreferrer">
          <em>app</em>
        </a>{' '}
        and{' '}
        <a href="https://www.electriqmarketing.com/" target={'_blank'} rel="noreferrer">
          <em>website</em>
        </a>
        , built and maintained websites for ecommerce clients
        {/* <a href="https://soylent.com/" target={'_blank'} rel="noreferrer">
          major
        </a>{' '}
        <a href="https://soylent.com/" target={'_blank'} rel="noreferrer">
          ecommerce
        </a>{' '}
        <a href="https://soylent.com/" target={'_blank'} rel="noreferrer">
          clients
        </a> */}
        {/* as well as their parent company{" "}
          <a href="https://www.drinks.com/" target={"_blank"} rel="noreferrer">
            <em>DRINKS</em>
          </a> */}
        , and tinkered with projects like{' '}
        <a href="https://qwikdraw.vercel.app/" target={'_blank'} rel="noreferrer">
          <em>QwikDraw</em>
        </a>{' '}
        and{' '}
        <a href="https://www.liftclub.app/" target={'_blank'} rel="noreferrer">
          <em>Lift Club</em>
        </a>{' '}
        in my free time.
      </motion.p>

      <motion.p variants={fade}>
        When I&apos;m not in front of my laptop, I&apos;m either out riding a bike or lifting. I also dabble with
        winemaking, photography, and learning how to think and write better.
      </motion.p>
    </Description>
  )
}
export default Bio

const Description = styled(motion.section)`
  margin: auto;
  border-radius: 7px;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
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
    font-size: 1.2rem;
    font-weight: 200;
    padding: 1rem 0;
  }

  p {
    font-weight: 200;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 1rem 0;
  }
`

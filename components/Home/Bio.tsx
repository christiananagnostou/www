import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'

function Bio() {
  return (
    <Description variants={staggerFade} className="max-w-screen">
      <motion.h1 variants={fade}>Christian Anagnostou</motion.h1>

      <motion.p variants={fade}>
        Attempting to create an <em>elegant</em> web experience for all.
      </motion.p>

      <p />

      <motion.p variants={fade}>
        At Electriq, I helped build their{' '}
        <a href="https://www.electriq.app/" target={'_blank'} rel="noreferrer">
          <em>app</em>
        </a>{' '}
        and{' '}
        <a href="https://www.electriqmarketing.com/" target={'_blank'} rel="noreferrer">
          <em>website</em>
        </a>
        , built and maintained websites for commercial commerce clients, and built projects like{' '}
        <a href="https://qwikdraw.vercel.app/" target={'_blank'} rel="noreferrer">
          <em>QwikDraw</em>
        </a>{' '}
        and{' '}
        <a href="https://www.liftclub.app/" target={'_blank'} rel="noreferrer">
          <em>Lift Club</em>
        </a>{' '}
        for my personal enjoyment.
      </motion.p>

      <motion.p variants={fade}>
        When I&apos;m not in front of my laptop, I&apos;m either out cycling or lifting. I also dabble with winemaking,{' '}
        <Link href="/art?tag=camera">photography</Link>, and learning how to think and write better.
      </motion.p>

      <p />

      <motion.p variants={fade}>
        catch me at{' '}
        <a href="https://twitter.com/coderdevguy" target={'_blank'} rel="noreferrer">
          @coderdevguy
        </a>
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

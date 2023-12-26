import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { fade, staggerFade } from '../animation'
import JukeboxLogo from '/public/logo-jukebox.png'
import LiftClubLogo from '/public/logo-liftclub.png'

type Props = {}

const FeaturedProjects = (props: Props) => {
  return (
    <Container variants={staggerFade}>
      <Link href={'https://www.liftclub.app/'} title="Lift Club - your new favorite workout app" target="_blank">
        <motion.p variants={fade} className="project-link">
          <Image
            src={LiftClubLogo}
            alt="Latest photo posted on my website - found on the art page."
            blurDataURL={LiftClubLogo.blurDataURL}
            placeholder="blur"
          />
          Lift Club
        </motion.p>
      </Link>
      <Link
        href={'https://github.com/christiananagnostou/jukebox'}
        title="Jukebox - your new favorite desktop music player"
        target="_blank"
      >
        <motion.p variants={fade} className="project-link">
          <Image
            src={JukeboxLogo}
            alt="Latest photo posted on my website - found on the art page."
            blurDataURL={JukeboxLogo.blurDataURL}
            placeholder="blur"
            className="darken"
          />
          Jukebox
        </motion.p>
      </Link>
    </Container>
  )
}

export default FeaturedProjects

const Container = styled(motion.section)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
  color: var(--text);

  .project-link {
    min-width: max-content;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-radius: 5px;
    padding: 0.5rem;
    background: var(--bg);
    border: 1px solid var(--accent);
    cursor: alias;
    font-size: 0.85rem;
    letter-spacing: 0.03em;

    img {
      height: 16px;
      width: 16px;
      border-radius: 3rem;

      transition: filter 0.2s ease;

      filter: grayscale(1);

      &.darken {
        filter: grayscale(1) brightness(0.5);
      }
    }

    &:hover img {
      filter: none;
    }
  }
`

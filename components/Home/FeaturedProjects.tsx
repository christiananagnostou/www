import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import JukeboxLogo from '../../public/logo-jukebox.webp'
import LiftClubLogo from '../../public/logo-liftclub.webp'
import { fade, staggerFade } from '../animation'

const VuoriLogo = () => (
  <svg
    className="darker"
    fill="currentColor"
    height="18"
    viewBox="0 0 457.89 457.89"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M365.36,345q-11.6,0-15.06-4.44t-3.47-15.06V149.86H330.31q-23,17.08-63.42,18.76v16.49q20.75,0,25.2,4t4.44,20.58V301.8c0,8.1-1.51,13.31-4.74,15.35-4.61,2.93-10.12,2.93-16.72,2.93l-60.19-153a28.14,28.14,0,0,1-1.72-8c0-5.43,1.94-8.62,5.13-10.62,2-1.28,5.23-2.57,12.4-2.57v-8.2H126.94v8.2c6.83.53,11.69,1.58,16.28,3.76a24.56,24.56,0,0,1,12.27,13L231.7,362.24H373.08V345h-7.72Z"
      transform="translate(-21.06 -21.06)"
    />
    <path
      d="M250,478.94C123.77,478.94,21.06,376.23,21.06,250S123.77,21.06,250,21.06,478.94,123.75,478.94,250,376.25,478.94,250,478.94Zm0-435.09C136.33,43.85,43.85,136.33,43.85,250S136.33,456.15,250,456.15,456.15,363.67,456.15,250,363.69,43.85,250,43.85Z"
      transform="translate(-21.06 -21.06)"
    />
  </svg>
)

const FeaturedProjects = () => (
  <Container variants={staggerFade}>
    <ProjectLink
      href="https://vuoriclothing.com/"
      target="_blank"
      title="Vuori - your new favorite clothing"
      variants={fade}
    >
      <VuoriLogo />
      Vuori
    </ProjectLink>

    <ProjectLink
      href="https://www.liftclub.app/"
      target="_blank"
      title="Lift Club - your new favorite workout app"
      variants={fade}
    >
      <Image alt="Lift Club logo" loading="eager" src={LiftClubLogo} />
      Lift Club
    </ProjectLink>

    <ProjectLink
      href="https://github.com/christiananagnostou/jukebox"
      target="_blank"
      title="Jukebox - your new favorite desktop music player"
      variants={fade}
    >
      <Image alt="Jukebox logo" className="darker" loading="eager" src={JukeboxLogo} />
      Jukebox
    </ProjectLink>
  </Container>
)

export default FeaturedProjects

const Container = styled(motion.section)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
  color: var(--text);
`

const ProjectLink = styled(motion.a)`
  min-width: max-content;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border-radius: 5px;
  padding: 0.5rem;
  background: var(--dark-bg);
  border: 1px solid var(--accent);
  cursor: alias;
  font-size: 0.85rem;
  letter-spacing: 0.03em;

  svg,
  img {
    height: 18px;
    width: 18px;
    object-fit: contain;
    transition: filter 0.2s ease;
    filter: grayscale(1);

    &.darker {
      filter: grayscale(1) brightness(0.7);
    }
  }

  &:hover svg,
  &:hover img {
    filter: none;
  }
`

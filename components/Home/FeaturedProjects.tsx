import * as m from 'framer-motion/m'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

import JukeboxLogo from '../../public/logo-jukebox.webp'
import LiftClubLogo from '../../public/logo-liftclub.webp'
import { fade } from '../animation'

const VuoriLogo = () => (
  <svg
    aria-hidden="true"
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

const projects = [
  { name: 'Vuori', href: 'https://vuoriclothing.com/', icon: <VuoriLogo /> },
  {
    name: 'Lift Club',
    href: '/work/liftclub',
    icon: <Image alt="" loading="eager" src={LiftClubLogo} />,
  },
  {
    name: 'Jukebox',
    href: '/work/jukebox',
    icon: <Image alt="" className="darker" loading="eager" src={JukeboxLogo} />,
  },
]

const entrance = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const ProjectLink = m.create(Link)

export default function FeaturedProjects() {
  return (
    <ProjectList aria-label="Selected projects" variants={entrance}>
      {projects.map(({ name, href, icon }) => (
        <ProjectLink
          key={name}
          href={href}
          {...(href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}
          variants={fade}
        >
          {icon}
          {name}
        </ProjectLink>
      ))}
    </ProjectList>
  )
}

const ProjectList = styled(m.nav)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 1.25rem;
  min-width: 0;
  padding: 0.25rem 1rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-height: max(44px, 2.75rem);
    font-size: 0.9rem;
    color: var(--heading);
    text-underline-offset: 0.22em;
  }
  @media (width <= 480px) {
    column-gap: 0.375rem;
    padding-inline: 0.25rem;
    a {
      gap: 0.2rem;
    }
  }
  img,
  svg {
    flex: none;
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: grayscale(1);
    transition: filter 0.2s ease;
    &.darker {
      filter: grayscale(1) brightness(0.7);
    }
  }
  a:is(:hover, :focus-visible) :is(img, svg) {
    filter: none;
  }
`

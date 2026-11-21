import * as m from 'framer-motion/m'
import styled from 'styled-components'

import { fade } from '../animation'

const projects = [
  { name: 'Vuori', href: 'https://vuoriclothing.com/' },
  { name: 'Lift Club', href: 'https://www.liftclub.app/' },
  { name: 'Jukebox', href: 'https://github.com/christiananagnostou/jukebox' },
]

const entrance = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function FeaturedProjects() {
  return (
    <ProjectList aria-label="Selected projects" variants={entrance}>
      {projects.map(({ name, href }) => (
        <m.a key={name} href={href} target="_blank" rel="noreferrer" variants={fade}>
          {name}
        </m.a>
      ))}
    </ProjectList>
  )
}

const ProjectList = styled(m.nav)`
  display: grid;
  justify-items: start;

  a {
    display: flex;
    align-items: center;
    min-height: 2.75rem;
    font-size: 1rem;
    text-underline-offset: 0.22em;
  }
`

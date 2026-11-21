import * as m from 'framer-motion/m'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { Heading } from '../components/Shared/Heading'
import ProjectHead from '../components/Work/ProjectHead'
import ProjectTile from '../components/Work/ProjectTile'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData, projectsUrl, projectsDescription } from '../lib/structured/projects'

const PageTitle = 'Projects | Christian Anagnostou'

export default function Projects() {
  const pageTransitionInitial = usePageTransitionInitial()

  return (
    <>
      <ProjectHead
        title={PageTitle}
        description={projectsDescription}
        url={projectsUrl}
        structured={getProjectsStructuredData(ProjectState)}
      />

      <Container animate="show" exit="exit" initial={pageTransitionInitial} variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Projects</h1>
          <p>
            The following showcase contains a selection of my work from freelance projects, past jobs, personal
            projects, and open-source. Carving and polishing this craft has been a passion of mine for over a decade and
            I&apos;ve had the pleasure of working with some amazing people and companies along the way.
          </p>
        </Heading>

        <m.section variants={staggerFade}>
          {ProjectState.map((project) => (
            <ProjectTile key={project.title} project={project} />
          ))}
        </m.section>
      </Container>
    </>
  )
}

const Container = styled(m.div)`
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

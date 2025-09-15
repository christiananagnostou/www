import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import ProjectTile from '../components/Work/ProjectTile'
import { BASE_URL } from '../lib/constants'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData } from '../lib/structured/projects'

const PageTitle = 'Projects | Christian Anagnostou'
const PageDescription = 'A showcase of freelance, personal, and open-source projects by Christian Anagnostou.'

export default function Projects() {
  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta content={PageDescription} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="index, follow" name="robots" />
        <meta content="Christian Anagnostou" name="author" />
        <meta content="projects, portfolio, freelance, personal, open-source, Christian Anagnostou" name="keywords" />
        <link href={`${BASE_URL}/projects`} rel="canonical" />

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content={PageTitle} property="og:title" />
        <meta content={PageDescription} property="og:description" />
        <meta content={`${BASE_URL}/projects`} property="og:url" />

        {/* Twitter Card */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={PageTitle} name="twitter:title" />
        <meta content={PageDescription} name="twitter:description" />

        {/* Structured Data */}
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProjectsStructuredData()) }}
          type="application/ld+json"
        />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Projects</h1>
          <p>
            The following showcase contains a selection of my work from freelance projects, past jobs, personal
            projects, and open-source. Carving and polishing this craft has been a passion of mine for over a decade and
            I&apos;ve had the pleasure of working with some amazing people and companies along the way.
          </p>
        </Heading>

        <motion.section variants={staggerFade}>
          {ProjectState.map((project) => (
            <ProjectTile key={project.title} project={project} />
          ))}
        </motion.section>
      </Container>
    </>
  )
}

const Container = styled(motion.div)`
  max-width: var(--max-w-screen);
  margin: 2rem auto;
  padding: 0 1rem;
  color: var(--text);
  overflow: hidden;
`

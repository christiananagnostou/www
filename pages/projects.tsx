import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { fade, pageAnimation, staggerFade } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import ProjectTile from '../components/Work/ProjectTile'
import { BASE_URL } from '../lib/constants'
import { ProjectState } from '../lib/projects'
import { getProjectsStructuredData } from '../lib/structured/projects'

type Props = {}

const PageTitle = 'Projects | Christian Anagnostou'
const PageDescription = 'A showcase of freelance, personal, and open-source projects by Christian Anagnostou.'

export default function Projects({}: Props) {
  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta name="description" content={PageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Christian Anagnostou" />
        <meta name="keywords" content="projects, portfolio, freelance, personal, open-source, Christian Anagnostou" />
        <link rel="canonical" href={`${BASE_URL}/projects`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PageTitle} />
        <meta property="og:description" content={PageDescription} />
        <meta property="og:url" content={`${BASE_URL}/projects`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PageTitle} />
        <meta name="twitter:description" content={PageDescription} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getProjectsStructuredData()) }}
        />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
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
            <ProjectTile project={project} key={project.title} />
          ))}
        </motion.section>
      </Container>
    </>
  )
}

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

import { motion } from 'framer-motion'
import Head from 'next/head'
import styled from 'styled-components'
import { pageAnimation } from '../components/animation'
import { Heading } from '../components/Shared/Heading'
import ProjectTile from '../components/Work/ProjectTile'
import { ProjectState } from '../lib/projects'

type Props = {}

export default function works({}: Props) {
  return (
    <>
      <Head>
        <title>Works</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Work id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        {/* <PageTitle titleLeft="my work" titleRight="ever improving" /> */}

        <Heading>
          <h1>A Curated List of My Work</h1>
        </Heading>

        <section>
          {ProjectState.map((project) => (
            <ProjectTile project={project} key={project.title} />
          ))}
        </section>
      </Work>
    </>
  )
}

const Work = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

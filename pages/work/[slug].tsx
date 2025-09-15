import { motion } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import type { GetStaticPaths, GetStaticProps } from 'next/types'
import styled from 'styled-components'

import { pageAnimation } from '../../components/animation'
import type { ProjectType } from '../../lib/projects'
import { ProjectState } from '../../lib/projects'

interface Props {
  project: ProjectType
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ProjectState.map((project) => ({ params: { slug: project.slug } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const project = ProjectState.find((proj) => proj.slug === context.params?.slug)
  return { props: { project } }
}

const SingleProject = ({ project }: Props) => {
  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta content="Christian Anagnostou's Web Portfolio" name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Container animate="show" exit="exit" initial="hidden" variants={pageAnimation}>
        <h2>{project.title}</h2>

        <div className="link-container">
          {project.externalLink ? (
            <motion.a className="live-link" href={project.externalLink} rel="noreferrer" target="_blank">
              Live Site
            </motion.a>
          ) : null}

          {project.github ? (
            <motion.a className="live-link" href={project.github} rel="noreferrer" target="_blank">
              Github
            </motion.a>
          ) : null}
        </div>

        <DesktopImage>
          <Image
            alt={project.title}
            blurDataURL={project.desktopImgs[0].blurDataURL}
            height={666}
            loading="eager"
            src={project.desktopImgs[0]}
            width={1000}
          />
        </DesktopImage>

        <MobileAndText>
          <Details>
            {project.details.map(({ title, description }, i) => (
              <Detail key={i} description={description} index={i} title={title} />
            ))}
          </Details>

          <div className="mobile-imgs">
            {project.mobileImgs.map((image, i) => (
              <MobileImage key={i}>
                <Image alt="mobile" blurDataURL={image.blurDataURL} height={600} src={image} width={300} />
              </MobileImage>
            ))}
          </div>
        </MobileAndText>

        {project.desktopImgs.slice(1).map((image, i) => (
          <DesktopImage key={i}>
            <Image alt={`desktop ${i}`} blurDataURL={image.blurDataURL} height={600} src={image} width={900} />
          </DesktopImage>
        ))}
      </Container>
    </>
  )
}

export default SingleProject

const Detail = ({ title, description, index }: { title: string; description: string; index: number }) => {
  return (
    <DetailStyle>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </DetailStyle>
  )
}

const Container = styled(motion.div)`
  max-width: var(--max-w-screen);
  padding: 1rem;
  margin: auto;

  h2 {
    color: #cfcfcf;
    padding-top: 5vh;
    font-size: 1.8rem;
    font-weight: 300;
  }
  .link-container {
    display: flex;
    margin: 1rem 0;

    .live-link {
      font-size: 1rem;
      color: #cccccc;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      margin-right: 30px;

      &:hover {
        color: #ffffff;
      }
    }
  }
`

const MobileAndText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0 0;
  overflow: hidden;

  .mobile-imgs {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    img {
    }
  }
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const DetailStyle = styled.div`
  padding: 1.5rem 1rem;
  background: var(--dark-bg);

  &:first-child {
    border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  }
  &:last-child {
    margin-bottom: 2rem;
    border-radius: 0 0 var(--border-radius-sm) var(--border-radius-sm);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 300;
  }
  p {
    padding-top: 1rem;
    font-weight: 200;
    line-height: 1.5rem;
  }
`

const DesktopImage = styled.div`
  img {
    max-width: 100%;
    margin-bottom: 2rem;
    display: block;
    height: auto;
    border-radius: var(--border-radius-sm);
  }
`

const MobileImage = styled.div`
  margin: 0 1rem;
  flex: 1;

  img {
    margin: auto;
    margin-bottom: 2rem;
    display: block;
    width: auto;
    max-height: 500px;
    max-width: 100%;
    border-radius: var(--border-radius-sm);
  }
`

import { motion } from 'framer-motion'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next/types'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

import { fade, pageAnimation, staggerFade } from '../../components/animation'
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
  if (!project) {
    return { notFound: true }
  }

  return { props: { project } }
}

const SingleProject = ({ project }: Props) => {
  const primaryImage = project.desktopImgs[0]
  const supportingDesktopImages = project.desktopImgs.slice(1)
  const hasMedia = project.desktopImgs.length > 0 || project.mobileImgs.length > 0
  const accent = getProjectAccent(project)

  return (
    <>
      <Head>
        <title>{project.title} | Christian Anagnostou</title>
        <meta content={project.summary} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Container
        $hasMedia={hasMedia}
        animate="show"
        exit="exit"
        initial="hidden"
        style={{ '--project-accent': accent } as CSSProperties}
        variants={pageAnimation}
      >
        <BackLink href="/projects">Projects</BackLink>

        <Hero $hasMedia={Boolean(primaryImage)} variants={staggerFade}>
          <HeroCopy variants={fade}>
            <ProjectKicker>
              <span>{project.date}</span>
              <span>{project.tags.join(' / ')}</span>
            </ProjectKicker>

            <h1>{project.title}</h1>
            <p>{project.summary}</p>

            <ActionRow aria-label={`${project.title} links`}>
              {project.externalLink ? (
                <a href={project.externalLink} rel="noreferrer" target="_blank">
                  {project.externalLinkLabel || 'Live Site'}
                </a>
              ) : null}

              {project.github ? (
                <a href={project.github} rel="noreferrer" target="_blank">
                  GitHub
                </a>
              ) : null}
            </ActionRow>
          </HeroCopy>

          {primaryImage ? (
            <HeroImage variants={fade}>
              <ProjectImage alt={`${project.title} project preview`} image={primaryImage} priority />
            </HeroImage>
          ) : null}
        </Hero>

        <BodyGrid $hasMedia={hasMedia}>
          <Details variants={staggerFade}>
            {project.details.length > 0 ? (
              project.details.map(({ title, description }) => (
                <Detail key={title} description={description} title={title} />
              ))
            ) : (
              <Detail description={project.summary} title="Overview" />
            )}
          </Details>

          <ProjectMeta variants={fade}>
            <MetaItem>
              <span>Type</span>
              <strong>{project.tags.join(', ')}</strong>
            </MetaItem>
            <MetaItem>
              <span>Date</span>
              <strong>{project.date}</strong>
            </MetaItem>
            <MetaItem>
              <span>Media</span>
              <strong>{hasMedia ? 'Screenshots' : 'Text-first'}</strong>
            </MetaItem>
          </ProjectMeta>
        </BodyGrid>

        {hasMedia ? (
          <MediaSection aria-label={`${project.title} screenshots`} variants={staggerFade}>
            {supportingDesktopImages.length > 0 ? (
              <WideGallery>
                {supportingDesktopImages.map((image, i) => (
                  <GalleryImage key={image.src} variants={fade}>
                    <ProjectImage alt={`${project.title} desktop screenshot ${i + 2}`} image={image} />
                  </GalleryImage>
                ))}
              </WideGallery>
            ) : null}

            {project.mobileImgs.length > 0 ? (
              <PhoneGallery>
                {project.mobileImgs.map((image, i) => (
                  <PhoneFrame key={image.src} variants={fade}>
                    <ProjectImage alt={`${project.title} mobile screenshot ${i + 1}`} image={image} />
                  </PhoneFrame>
                ))}
              </PhoneGallery>
            ) : null}
          </MediaSection>
        ) : null}
      </Container>
    </>
  )
}

export default SingleProject

const Detail = ({ title, description }: { title: string; description: string }) => {
  return (
    <DetailStyle>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </DetailStyle>
  )
}

const ProjectImage = ({
  alt,
  image,
  priority = false,
}: {
  alt: string
  image: ProjectType['desktopImgs'][number]
  priority?: boolean
}) => {
  return (
    <Image
      alt={alt}
      height={image.height}
      {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      sizes="(width >= 980px) 900px, calc(100vw - 32px)"
      src={image}
      width={image.width}
    />
  )
}

const getProjectAccent = (project: ProjectType) => {
  if (project.tags.includes('commercial')) {
    return '#b8a266'
  }

  if (project.tags.includes('open-source')) {
    return '#72c8b7'
  }

  return '#8da1d9'
}

const Container = styled(motion.main)<{ $hasMedia: boolean }>`
  --page-width: ${({ $hasMedia }) => ($hasMedia ? '1040px' : '820px')};

  max-width: var(--page-width);
  padding: 2rem 1rem 5rem;
  margin: auto;
  color: var(--text);
`

const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: 3.5rem;
  font-size: 0.8rem;
  color: var(--text-dark);
  text-decoration: none;

  &::before {
    content: '/';
    margin-right: 0.45rem;
    color: var(--project-accent);
  }

  &:hover {
    color: var(--heading);
    text-decoration: none;
  }
`

const Hero = styled(motion.header)<{ $hasMedia: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasMedia }) => ($hasMedia ? 'minmax(0, 0.85fr) minmax(320px, 1.15fr)' : '1fr')};
  gap: 2rem;
  align-items: end;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--accent);

  @media screen and (width <= 860px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

const HeroCopy = styled(motion.div)`
  h1 {
    max-width: 34rem;
    margin: 0.85rem 0 1rem;
    font-weight: normal;
    font-size: clamp(2.35rem, 8vw, 5.4rem);
    line-height: 0.96;
  }

  p {
    max-width: 680px;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text);
  }
`

const ProjectKicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  color: var(--text-dark);
  font-size: 0.75rem;
  text-transform: uppercase;

  span {
    font-weight: 500;
  }

  span:first-child {
    color: var(--project-accent);
  }
`

const ActionRow = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;

  a {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0 0.9rem;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    color: var(--heading);
    font-size: 0.8rem;
    text-decoration: none;

    &:hover {
      border-color: var(--project-accent);
      color: #ffffff;
      text-decoration: none;
    }
  }
`

const HeroImage = styled(motion.figure)`
  align-self: stretch;
  margin: 0;
  padding: 0.45rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);

  img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 280px;
    max-height: 560px;
    object-fit: contain;
    border-radius: var(--border-radius-sm);
  }
`

const BodyGrid = styled.div<{ $hasMedia: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasMedia }) => ($hasMedia ? 'minmax(0, 1fr) 220px' : '1fr')};
  gap: 2rem;
  align-items: start;
  margin: 3rem 0;

  @media screen and (width <= 760px) {
    grid-template-columns: 1fr;
    margin: 2rem 0;
  }
`

const Details = styled(motion.section)`
  display: grid;
  gap: 0;
`

const DetailStyle = styled.div`
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1.35rem 0;
  border-top: 1px solid var(--accent);

  &:last-child {
    border-bottom: 1px solid var(--accent);
  }

  @media screen and (width <= 640px) {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  h3 {
    color: var(--heading);
    font-weight: normal;
    font-size: 0.95rem;
  }

  p {
    font-weight: 200;
    font-size: 0.95rem;
    line-height: 1.65;
  }
`

const ProjectMeta = styled(motion.aside)`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: rgb(20 20 20 / 45%);

  @media screen and (width <= 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media screen and (width <= 520px) {
    grid-template-columns: 1fr;
  }
`

const MetaItem = styled.div`
  display: grid;
  gap: 0.35rem;

  span {
    color: var(--text-dark);
    font-weight: normal;
    font-size: 0.72rem;
    text-transform: uppercase;
  }

  strong {
    color: var(--heading);
    font-weight: normal;
    font-size: 0.85rem;
    line-height: 1.4;
  }
`

const MediaSection = styled(motion.section)`
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;
`

const WideGallery = styled.div`
  display: grid;
  gap: 1.25rem;
`

const GalleryImage = styled(motion.figure)`
  margin: 0;
  padding: 0.45rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: var(--dark-bg);

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-sm);
  }
`

const PhoneGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.25rem;
  align-items: start;
`

const PhoneFrame = styled(motion.figure)`
  margin: 0;
  padding: 0.55rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-lg);
  background: var(--dark-bg);

  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 640px;
    object-fit: contain;
    border-radius: var(--border-radius-md);
  }
`

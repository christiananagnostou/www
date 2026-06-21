import * as m from 'framer-motion/m'
import Head from 'next/head'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next/types'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

import { fade, pageAnimation, staggerFade } from '../../components/animation'
import { usePageTransitionInitial } from '../../components/animation/MotionProvider'
import type { ProjectShowcaseType, ProjectType } from '../../lib/projects'
import { ProjectState } from '../../lib/projects'

interface Props {
  project: ProjectType
}

type ProjectLinkType = { href: string; label: string }
type ProjectDetailType = ProjectType['details'][number]

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
  const pageTransitionInitial = usePageTransitionInitial()
  const primaryImage = project.desktopImgs[0]
  const supportingDesktopImages = project.desktopImgs.slice(1)
  const hasMedia = hasProjectMedia(project)
  const accent = getProjectAccent(project.slug)
  const projectLinks = getProjectLinks(project)
  const projectDetails = getProjectDetails(project)

  return (
    <>
      <Head>
        <title>{project.title} | Christian Anagnostou</title>
        <meta content={project.summary} name="description" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <Container
        animate="show"
        exit="exit"
        initial={pageTransitionInitial}
        style={{ '--project-accent': accent } as CSSProperties}
        variants={pageAnimation}
      >
        <BackLink href="/projects">Projects</BackLink>

        <Hero variants={staggerFade}>
          <HeroCopy variants={fade}>
            <ProjectKicker>
              <span>{project.date}</span>
            </ProjectKicker>

            <h1>{project.title}</h1>
            <p>{project.summary}</p>

            {projectLinks.length > 0 ? (
              <ActionRow aria-label={`${project.title} links`}>
                {projectLinks.map(({ href, label }) => (
                  <a key={label} href={href} rel="noreferrer" target="_blank">
                    {label}
                  </a>
                ))}
              </ActionRow>
            ) : null}
          </HeroCopy>
        </Hero>

        {primaryImage ? (
          <FeaturedMedia variants={fade}>
            <ProjectImage alt={`${project.title} project preview`} image={primaryImage} priority />
          </FeaturedMedia>
        ) : null}

        {project.showcase ? <CliShowcase showcase={project.showcase} /> : null}

        <BodyGrid $hasMedia={hasMedia}>
          <Details variants={staggerFade}>
            {projectDetails.map(({ title, description }) => (
              <Detail key={title} description={description} title={title} />
            ))}
          </Details>

          <ProjectMeta variants={fade}>
            {project.meta.map(({ label, value }) => (
              <MetaItem key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </MetaItem>
            ))}
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

const CliShowcase = ({ showcase }: { showcase: ProjectShowcaseType }) => {
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)
  const command = showcase.commands[activeCommandIndex]

  if (!command) {
    return null
  }

  return (
    <CliPanel variants={fade}>
      <CliIntro>
        <span>CLI preview</span>
        <h2>{showcase.title}</h2>
        <p>{showcase.description}</p>
      </CliIntro>

      <CliShell>
        <CliTabs aria-label="Skillbox command examples">
          {showcase.commands.map(({ label }, index) => (
            <button
              key={label}
              aria-pressed={activeCommandIndex === index}
              onClick={() => setActiveCommandIndex(index)}
              type="button"
            >
              {label}
            </button>
          ))}
        </CliTabs>

        <Terminal aria-live="polite">
          <TerminalBar>
            <span />
            <span />
            <span />
          </TerminalBar>
          <TerminalCommand>
            <span>$</span>
            <code>{command.command}</code>
          </TerminalCommand>
          <TerminalOutput>
            {command.output.map((line, index) => (
              <code key={`${line}-${index}`}>{line}</code>
            ))}
          </TerminalOutput>
        </Terminal>
      </CliShell>
    </CliPanel>
  )
}

const ProjectImage = ({
  alt,
  image,
  priority = false,
}: {
  alt: string
  image: StaticImageData
  priority?: boolean
}) => {
  const loadingProps = priority ? { priority: true } : { loading: 'lazy' as const }

  return (
    <Image
      alt={alt}
      height={image.height}
      {...loadingProps}
      sizes="(width >= 800px) 768px, calc(100vw - 32px)"
      src={image}
      width={image.width}
    />
  )
}

const getProjectLinks = (project: ProjectType) => {
  const links: ProjectLinkType[] = []

  if (project.externalLink) {
    links.push({ href: project.externalLink, label: project.externalLinkLabel ?? 'Live Site' })
  }

  if (project.github) {
    links.push({ href: project.github, label: 'GitHub' })
  }

  return links
}

const getProjectDetails = (project: ProjectType): ProjectDetailType[] => {
  if (project.details.length > 0) {
    return project.details
  }

  return [{ title: 'Overview', description: project.summary }]
}

const hasProjectMedia = (project: ProjectType) => {
  return project.desktopImgs.length > 0 || project.mobileImgs.length > 0
}

const getProjectAccent = (slug: string) => {
  const accents = ['#72c8b7', '#b8a266', '#8da1d9', '#d08a72', '#a4bd78'] as const
  const index = slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % accents.length

  return accents[index]
}

const Container = styled(m.main)`
  width: 100%;
  max-width: var(--max-w-screen);
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

const Hero = styled(m.header)`
  display: grid;
  padding-bottom: 1.25rem;
`

const HeroCopy = styled(m.div)`
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

const FeaturedMedia = styled(m.figure)`
  width: 100%;
  margin: 1.25rem auto 0;
  padding: 0.55rem;
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

const CliPanel = styled(m.section)`
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(340px, 1.25fr);
  gap: 1.5rem;
  align-items: stretch;
  margin: 2rem 0 0;
  padding: 1rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: rgb(20 20 20 / 45%);

  @media screen and (width <= 760px) {
    grid-template-columns: 1fr;
  }
`

const CliIntro = styled.div`
  display: grid;
  align-content: start;
  gap: 0.8rem;
  padding: 0.25rem;

  span {
    color: var(--project-accent);
    font-weight: 500;
    font-size: 0.72rem;
    text-transform: uppercase;
  }

  h2 {
    font-weight: normal;
    font-size: 1.35rem;
  }

  p {
    max-width: 360px;
    font-size: 0.92rem;
    line-height: 1.55;
  }
`

const CliShell = styled.div`
  display: grid;
  gap: 0.75rem;
`

const CliTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;

  button {
    min-height: 36px;
    border: 1px solid var(--accent);
    border-radius: var(--border-radius-sm);
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease,
      background 0.2s ease;

    &[aria-pressed='true'] {
      border-color: var(--project-accent);
      background: rgb(255 255 255 / 4%);
      color: var(--heading);
    }

    &:hover {
      color: var(--heading);
    }
  }

  @media screen and (width <= 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const Terminal = styled.div`
  min-height: 248px;
  padding: 0.9rem;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius-md);
  background: #0f0f0f;
  overflow: hidden;
`

const TerminalBar = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);

    &:first-child {
      background: var(--project-accent);
    }
  }
`

const TerminalCommand = styled.div`
  display: flex;
  gap: 0.65rem;
  margin-bottom: 0.9rem;
  color: var(--heading);
  font-family: 'SFMono-Regular', 'Menlo', 'Consolas', monospace;
  font-size: 0.84rem;
  line-height: 1.55;

  span {
    color: var(--project-accent);
    font-weight: normal;
  }
`

const TerminalOutput = styled.pre`
  display: grid;
  gap: 0.32rem;
  margin: 0;
  color: var(--text);
  font-family: 'SFMono-Regular', 'Menlo', 'Consolas', monospace;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-wrap;

  code {
    font-family: inherit;
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

const Details = styled(m.section)`
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

const ProjectMeta = styled(m.aside)`
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

const MediaSection = styled(m.section)`
  display: grid;
  gap: 1.25rem;
  margin-top: 2.5rem;
`

const WideGallery = styled.div`
  display: grid;
  gap: 1.25rem;
  width: 100%;
  margin: 0 auto;
`

const GalleryImage = styled(m.figure)`
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

const PhoneFrame = styled(m.figure)`
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

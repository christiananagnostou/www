import * as m from 'framer-motion/m'
import dynamic from 'next/dynamic'
import Image, { type StaticImageData } from 'next/image'
import type { GetStaticPaths, GetStaticProps } from 'next/types'
import { useState } from 'react'

import { fade, pageAnimation, staggerFade } from '../../components/animation'
import LiftClubStudy from '../../components/Work/LiftClubStudy'
import JukeboxStudy from '../../components/Work/JukeboxStudy'
import ProjectsBackLink from '../../components/Work/ProjectsBackLink'
import { projectTheme } from '../../components/Work/projectTheme'
import ProjectHead from '../../components/Work/ProjectHead'
import { usePageTransitionInitial } from '../../components/animation/MotionProvider'
import type { ProjectShowcaseType, ProjectType } from '../../lib/projects'
import { ProjectState } from '../../lib/projects'
import { projectMetadata } from '../../lib/structured/projects'

import styles from '../../styles/pages/Project.module.css'

interface Props {
  project: ProjectType
}

const ImgPressStudy = dynamic(() => import('../../components/Work/ImgPressStudy'))

type ProjectLinkType = { href: string; label: string }
type ProjectDetailType = ProjectType['details'][number]

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ProjectState.map((project) => ({ params: { slug: project.slug } })),
    fallback: false,
  }
}

// These pages render full images without blur placeholders.
const projectImageProps = ({ src, width, height }: StaticImageData) => ({ src, width, height })

export const getStaticProps: GetStaticProps = async (context) => {
  const project = ProjectState.find((proj) => proj.slug === context.params?.slug)
  if (!project) {
    return { notFound: true }
  }

  return {
    props: {
      project: {
        ...project,
        desktopImgs: project.desktopImgs.map(projectImageProps),
        mobileImgs: project.mobileImgs.map(projectImageProps),
      },
    },
  }
}

const SingleProject = ({ project }: Props) => (
  <>
    <ProjectHead {...projectMetadata(project)} />
    {project.slug === 'liftclub' ? (
      <LiftClubStudy project={project} />
    ) : project.slug === 'jukebox' ? (
      <JukeboxStudy project={project} />
    ) : project.slug === 'imgpress' ? (
      <ImgPressStudy project={project} />
    ) : (
      <DefaultProject project={project} />
    )}
  </>
)

const DefaultProject = ({ project }: Props) => {
  const pageTransitionInitial = usePageTransitionInitial()
  const primaryImage = project.desktopImgs[0]
  const supportingDesktopImages = project.desktopImgs.slice(1)
  const hasMedia = hasProjectMedia(project)
  const projectLinks = getProjectLinks(project)
  const projectDetails = getProjectDetails(project)

  return (
    <m.main
      className={styles.container}
      animate="show"
      exit="exit"
      initial={pageTransitionInitial}
      style={projectTheme(project.themeColor)}
      variants={pageAnimation}
    >
      <ProjectsBackLink />

      <m.header className={styles.hero} variants={staggerFade}>
        <m.div className={styles.heroCopy} variants={fade}>
          <div className={styles.projectKicker}>
            <span>{project.date}</span>
          </div>

          <h1>{project.title}</h1>
          <p>{project.summary}</p>

          {projectLinks.length > 0 ? (
            <nav className={styles.actionRow} aria-label={`${project.title} links`}>
              {projectLinks.map(({ href, label }) => (
                <a key={label} href={href} rel="noreferrer" target="_blank">
                  {label}
                </a>
              ))}
            </nav>
          ) : null}
        </m.div>
      </m.header>

      {primaryImage ? (
        <m.figure className={styles.featuredMedia} variants={fade}>
          <ProjectImage alt={`${project.title} project preview`} image={primaryImage} priority />
        </m.figure>
      ) : null}

      {project.showcase ? <CliShowcase showcase={project.showcase} /> : null}

      <div data-media={hasMedia || undefined} className={styles.bodyGrid}>
        <m.section className={styles.details} variants={staggerFade}>
          {projectDetails.map(({ title, description }) => (
            <Detail key={title} description={description} title={title} />
          ))}
        </m.section>

        <m.aside className={styles.projectMeta} variants={fade}>
          {project.meta.map(({ label, value }) => (
            <div className={styles.metaItem} key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </m.aside>
      </div>

      {hasMedia ? (
        <m.section className={styles.mediaSection} aria-label={`${project.title} screenshots`} variants={staggerFade}>
          {supportingDesktopImages.length > 0 ? (
            <div className={styles.wideGallery}>
              {supportingDesktopImages.map((image, i) => (
                <m.figure className={styles.galleryImage} key={image.src} variants={fade}>
                  <ProjectImage alt={`${project.title} desktop screenshot ${i + 2}`} image={image} />
                </m.figure>
              ))}
            </div>
          ) : null}

          {project.mobileImgs.length > 0 ? (
            <div className={styles.phoneGallery}>
              {project.mobileImgs.map((image, i) => (
                <m.figure className={styles.phoneFrame} key={image.src} variants={fade}>
                  <ProjectImage alt={`${project.title} mobile screenshot ${i + 1}`} image={image} />
                </m.figure>
              ))}
            </div>
          ) : null}
        </m.section>
      ) : null}
    </m.main>
  )
}

export default SingleProject

const Detail = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className={styles.detailStyle}>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  )
}

const CliShowcase = ({ showcase }: { showcase: ProjectShowcaseType }) => {
  const [activeCommandIndex, setActiveCommandIndex] = useState(0)
  const command = showcase.commands[activeCommandIndex]

  if (!command) {
    return null
  }

  return (
    <m.section className={styles.cliPanel} variants={fade}>
      <div className={styles.cliIntro}>
        <span>CLI preview</span>
        <h2>{showcase.title}</h2>
        <p>{showcase.description}</p>
      </div>

      <div className={styles.cliShell}>
        <div className={styles.cliTabs} aria-label="Skillbox command examples">
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
        </div>

        <div className={styles.terminal} aria-live="polite">
          <div className={styles.terminalBar}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.terminalCommand}>
            <span>$</span>
            <code>{command.command}</code>
          </div>
          <pre className={styles.terminalOutput}>
            {command.output.map((line, index) => (
              <code key={`${line}-${index}`}>{line}</code>
            ))}
          </pre>
        </div>
      </div>
    </m.section>
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

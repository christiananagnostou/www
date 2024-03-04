import { AnimationControls, motion, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { Project } from '../../types'
import { fade, lineAnim, photoAnim } from '../animation'
import { useScroll } from '../Hooks'

type Props = {
  project: Project
}

const ProjectTile = ({ project }: Props) => {
  const [ref, controls] = useScroll()

  return (
    <ProjectContainer
      ref={ref as React.Ref<HTMLDivElement>}
      variants={fade as Variants}
      animate={controls as AnimationControls}
      initial="hidden"
    >
      <motion.header variants={lineAnim}>
        <Link href={'/work/' + project.slug}>
          <h3>{project.title}</h3>
        </Link>

        <div className="links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}

          {project.externalLink ? (
            <a href={project.externalLink} target="_blank" rel="noreferrer">
              Live Site
            </a>
          ) : (
            <span>Shut Down</span>
          )}
        </div>
      </motion.header>

      <Link href={'/work/' + project.slug} className="image-container">
        <motion.span variants={fade} className="summary">
          {project.summary}

          <span className="date">{project.date}</span>
        </motion.span>

        <Hide className="project-tile__image-hide">
          <Img
            variants={photoAnim}
            src={project.desktopImgs[0]}
            alt={project.title}
            blurDataURL={project.desktopImgs[0].blurDataURL}
            placeholder="blur"
          />
        </Hide>
      </Link>
    </ProjectContainer>
  )
}

export default ProjectTile

const Img = styled(motion(Image))`
  display: block;
  height: auto;
  width: 100%;
  max-width: 100%;
  border-radius: 5px;
`

const ProjectContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 4rem;

  @media screen and (min-width: 768px) {
    margin-bottom: 6rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--accent);
    margin-bottom: 1rem;

    h3 {
      display: inline-block;
      min-width: max-content;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--heading);
      transition: all 0.2s ease-in-out;

      &:hover {
        color: white;
      }
    }
    .links {
      a,
      span {
        text-decoration: none;
        display: inline-block;
        font-size: 1rem;
        font-weight: 400;
        color: var(--text);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        margin-left: 20px;

        &:not(span):hover {
          color: white;
        }
      }
    }
  }
  .image-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-decoration: none !important;

    @media screen and (min-width: 768px) {
      flex-direction: row;
    }

    img {
      display: block;
      object-fit: cover;
      object-position: center;
      width: 100%;
    }

    .summary {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 1rem;
      line-height: 1.4rem;
      letter-spacing: 0.015em;
      font-weight: 500;

      .date {
        font-size: 0.7rem;
        font-weight: 300;
        text-align: left;
        color: var(--text-dark);
      }

      @media screen and (min-width: 768px) {
        max-width: 50%;
        min-width: 50%;
      }
    }
  }

  &:hover .project-tile__image-hide {
    box-shadow: 0 5px 10px 5px rgba(20, 20, 20, 0.9);
  }
`

const Hide = styled.div`
  overflow: hidden;
  border-radius: 5px;
  transition: all 0.5s ease;
  width: 100%;
`

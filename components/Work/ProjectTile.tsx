import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import type { ProjectType } from '../../lib/projects'
import { fade, lineAnim } from '../animation'

interface Props {
  project: ProjectType
}

const ProjectTile = ({ project }: Props) => {
  return (
    <ProjectContainer variants={fade}>
      <motion.header variants={lineAnim}>
        <Link href={`/work/${project.slug}`}>
          <h2>{project.title}</h2>
        </Link>

        <div className="links">
          {project.github ? (
            <a href={project.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
          ) : null}

          {project.externalLink ? (
            <a href={project.externalLink} rel="noreferrer" target="_blank">
              Live Site
            </a>
          ) : (
            <span>Shut Down</span>
          )}
        </div>
      </motion.header>

      <motion.span className="summary" variants={fade}>
        {project.summary}

        <span className="date">{project.date}</span>
      </motion.span>
    </ProjectContainer>
  )
}

export default ProjectTile

const ProjectContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 3.5rem;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--accent);

    h2 {
      display: inline-block;
      min-width: max-content;
      font-weight: 500;
      font-size: 1.1rem;
      color: var(--heading);
      transition: all 0.2s ease-in-out;

      &:hover {
        color: #ffffff;
      }
    }
    .links {
      a,
      span {
        display: inline-block;
        margin-left: 20px;
        font-weight: normal;
        font-size: 0.8rem;
        color: var(--text);
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        &:not(span):hover {
          color: #ffffff;
        }
      }
    }
  }

  @media screen and (width >= 768px) {
    flex-direction: row;
  }

  .summary {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    font-weight: normal;
    font-size: 0.9rem;
    line-height: 1.4rem;

    .date {
      min-width: max-content;
      font-weight: 300;
      font-size: 0.7rem;
      color: var(--text-dark);
    }
  }
`

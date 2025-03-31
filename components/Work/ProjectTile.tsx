import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import { Project } from '../../types'
import { fade, lineAnim } from '../animation'

type Props = {
  project: Project
}

const ProjectTile = ({ project }: Props) => {
  return (
    <ProjectContainer variants={fade}>
      <motion.header variants={lineAnim}>
        <Link href={'/work/' + project.slug}>
          <h2>{project.title}</h2>
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

      <motion.span variants={fade} className="summary">
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
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--accent);
    margin-bottom: 0.5rem;

    h2 {
      display: inline-block;
      min-width: max-content;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--heading);
      transition: all 0.2s ease-in-out;

      &:hover {
        color: #ffffff;
      }
    }
    .links {
      a,
      span {
        text-decoration: none;
        display: inline-block;
        font-size: 0.8rem;
        font-weight: normal;
        color: var(--text);
        transition: all 0.2s ease-in-out;
        margin-left: 20px;

        &:not(span):hover {
          color: #ffffff;
        }
      }
    }
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }

  .summary {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
    font-size: 0.9rem;
    line-height: 1.4rem;
    font-weight: normal;

    .date {
      min-width: max-content;
      font-size: 0.7rem;
      font-weight: 300;
      color: var(--text-dark);
    }
  }
`

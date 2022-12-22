import React from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fade, photoAnim, lineAnim } from "../../animation";
import { useScroll } from "../useScroll";

export default function ProjectTile({ project }) {
  const [element, controls] = useScroll();

  return (
    <Project variants={fade} ref={element} animate={controls} initial="hidden">
      <motion.header variants={lineAnim}>
        <Link to={project.url}>
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

      <Link to={project.url} className="image-container">
        <Hide>
          <motion.img variants={photoAnim} src={project.desktopImgs[0]} alt={project.title} />
        </Hide>

        <motion.span variants={fade} className="summary">
          {project.summary}
        </motion.span>
      </Link>
    </Project>
  );
}

const Project = styled(motion.div)`
  position: relative;
  margin-bottom: 4rem;

  @media screen and (min-width: 768px) {
    margin-bottom: 6rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(20, 20, 20, 0.5);
    border-radius: 5px;
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
    flex-direction: column-reverse;
    gap: 1rem;
    padding: 0 1rem;
    text-decoration: none !important;

    @media screen and (min-width: 768px) {
      padding: 0;
      flex-direction: row;
    }

    img {
      display: block;
      object-fit: cover;
      object-position: center;
      width: 100%;
    }

    .summary {
      display: inline-block;
      font-size: 1rem;
      line-height: 1.4rem;
      letter-spacing: 0.015em;
      font-weight: 500;

      @media screen and (min-width: 768px) {
        max-width: 30%;
        min-width: 30%;
      }
    }
  }
`;

const Hide = styled.div`
  overflow: hidden;
  border-radius: 5px;
  transition: all 0.5s ease;
  width: 100%;

  &:hover {
    box-shadow: 0 5px 20px 10px rgba(20, 20, 20, 0.9);
  }
`;

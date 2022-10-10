import React from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
// Animations
import { motion } from "framer-motion";
import { fade, photoAnim, lineAnim } from "../../../animation";
import { useScroll } from "../../useScroll";

export default function ProjectTile({ project }) {
  const [element, controls] = useScroll();

  return (
    <Project ref={element} variants={fade} animate={controls} initial="hidden">
      <motion.header variants={lineAnim}>
        <Link to={project.url}>
          {" "}
          <h3>{project.title}</h3>
        </Link>

        <div className="links">
          <motion.a href={project.externalLink} target="_blank" rel="noreferrer">
            Live Site
          </motion.a>
          <motion.a href={project.github} target="_blank" rel="noreferrer">
            GitHub
          </motion.a>
        </div>
      </motion.header>

      <Link to={project.url}>
        <Hide>
          <motion.img variants={photoAnim} src={project.desktopImgs[0]} alt={project.title} />
        </Hide>
      </Link>
    </Project>
  );
}

const Project = styled(motion.div)`
  position: relative;
  margin-bottom: 8rem;

  @media screen and (min-width: 768px) {
    margin-bottom: 10rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    background: rgba(20, 20, 20, 0.5);
    margin-bottom: 1rem;

    h3 {
      display: inline-block;
      min-width: max-content;
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--heading);
      transition: all 0.2s ease-in-out;

      &:hover {
        color: white;
      }
    }
    .links {
      a {
        text-decoration: none;
        font-size: 1rem;
        color: var(--text);
        border-bottom: 1px solid var(--accent);
        padding: 0.1rem 0.4rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        margin-left: 10px;
        &:hover {
          color: var(--heading);
          border-bottom: 1px solid var(--accent);
        }
      }
    }
  }
  img {
    display: block;
    width: 100%;
    border-radius: 5px;
    object-fit: cover;
    object-position: center;
  }
`;

const Hide = styled.div`
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.5s ease;

  &:hover {
    box-shadow: 0 5px 20px 10px rgba(20, 20, 20, 0.9);
  }
`;

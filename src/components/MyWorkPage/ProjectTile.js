import React from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
// Animations
import { motion } from "framer-motion";
import { fade, photoAnim, lineAnim } from "../../animation";
import { useScroll } from "../useScroll";

export default function ProjectTile({ project }) {
  const [element1, controls1] = useScroll();

  return (
    <Project ref={element1} variants={fade} animate={controls1} initial="hidden">
      <div>
        <h2>{project.title}</h2>
        <div className="links">
          <motion.a href={project.externalLink} target="_blank" rel="noreferrer">
            Live view
          </motion.a>
          <motion.a href={project.github} target="_blank" rel="noreferrer">
            GitHub
          </motion.a>
        </div>
      </div>
      <motion.div variants={lineAnim} className="line"></motion.div>
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
  padding-bottom: 10rem;
  width: 70%;
  margin: auto;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      display: inline-block;
      width: fit-content;
    }
    .links {
      display: inline-block;
      min-width: fit-content;
      a {
        text-decoration: none;
        font-size: 1.5rem;
        color: #4a4a4a;
        border: 1px solid #4a4a4a;
        padding: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        margin-left: 10px;
        &:hover {
          background: #d8d8d8;
        }
      }
    }
  }
  .line {
    height: 0.5rem;
    background: #fe5a1d;
    margin-bottom: 3rem;
  }
  img {
    width: 100%;
    height: 70vh;
    object-fit: cover;
    object-position: left;
  }
  @media (max-width: 1000px) {
    width: 90%;
    padding-bottom: 5rem;
    div {
      h2 {
        font-size: 3em;
      }
    }
    img {
      height: 50vh;
    }
  }
  @media (max-width: 500px) {
    width: 95%;
    padding-bottom: 10rem;
    div {
      h2 {
        font-size: 2.5em;
      }
    }
    img {
      height: 35vh;
    }
  }
`;

const Hide = styled.div`
  overflow: hidden;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 25px 40px #adadad;
  }
`;

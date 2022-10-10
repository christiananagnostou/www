import React from "react";
import styled from "styled-components";
// State
import { projectState } from "../../../projectState";
// Components
import ProjectTile from "./ProjectTile";
// Animations
import { motion } from "framer-motion";
import { fade } from "../../../animation";
import ScrollTop from "../../ScrollTop";

function ProjectList() {
  return (
    <Work id="work" variants={fade}>
      <motion.h2 className="title">My Work</motion.h2>

      {projectState.map((project) => (
        <ProjectTile project={project} key={project.title} />
      ))}

      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  overflow: hidden;
  padding: 5rem 1rem;
  color: var(--text);
  max-width: var(--max-w-screen);
  margin: auto;

  .title {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.4rem;
    color: var(--text);
    font-weight: 200;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--accent);
  }
`;

export default ProjectList;

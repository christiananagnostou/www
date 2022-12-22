import React from "react";
import styled from "styled-components";
// State
import { projectState } from "../../projectState";
// Components
import ProjectTile from "./ProjectTile";
// Animations
import { motion } from "framer-motion";
import { fade, pageAnimation } from "../../animation";
import ScrollTop from "../ScrollTop";

function ProjectList() {
  return (
    <Work id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <motion.h2 variants={fade} className="title">
        <span>my curated</span>
        <span className="bar"></span>
        <span>web creations</span>
      </motion.h2>

      <ProjectListStyle>
        {projectState.map((project) => (
          <ProjectTile project={project} key={project.title} />
        ))}
      </ProjectListStyle>

      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);

  padding: 0 1rem;
  margin: 1.5rem auto;

  @media screen and (min-width: 768px) {
    margin: 5rem auto;
  }

  .title {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (min-width: 768px) {
      margin-bottom: 2rem;
    }

    span {
      font-weight: 200;
      font-size: 0.9rem;
      color: var(--text);
    }

    .bar {
      height: 0;
      flex: 1;
      margin: 0 1rem;
      border-bottom: 1px solid var(--accent);
    }
  }
`;

const ProjectListStyle = styled.section``;

export default ProjectList;

import React from "react";
import styled from "styled-components";

import { projectState } from "../../projectState";
import ProjectTile from "./ProjectTile";
// Animations
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";
import ScrollTop from "../ScrollTop";

function MyWork() {
  console.log(projectState);
  return (
    <Work
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{ background: "white" }}
    >
      {projectState.map((project) => (
        <ProjectTile project={project} key={project.title} />
      ))}

      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  min-height: 100vh;
  overflow: hidden;
  padding: 5rem 8rem;
  color: #4a4a4a;
  h2 {
    padding: 1rem 0;
  }
  @media (max-width: 1500px) {
    padding: 2rem 0rem;
  }
`;

export default MyWork;

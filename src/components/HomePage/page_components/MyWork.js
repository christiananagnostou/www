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
// Hooks
import { useScroll } from "../../useScroll";

function MyWork() {
  const [element, controls] = useScroll();
  return (
    <Work id="work">
      <motion.h2
        ref={element}
        variants={fade}
        animate={controls}
        initial="hidden"
        className="title"
      >
        My Work
      </motion.h2>

      {projectState.map((project) => (
        <ProjectTile project={project} key={project.title} />
      ))}

      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  overflow: hidden;
  padding: 5rem 8rem;
  color: white;

  .title {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 3rem;
    font-size: 3rem;
    color: #ccc;
    font-weight: 200;
  }
  @media (max-width: 1500px) {
    padding: 0rem;
  }
`;

export default MyWork;

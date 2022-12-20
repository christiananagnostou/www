import React from "react";
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";
import Bio from "./Bio";
// import Faq from "./Faq";
import SocialLinks from "../SocialLinks";
import styled from "styled-components";

function AboutMe() {
  return (
    <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <Bio />
      {/* <Faq /> */}
      <SocialLinks />
    </Container>
  );
}

export default AboutMe;

const Container = styled(motion.main)`
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 1rem;

  @media screen and (min-width: 768px) {
    padding: 5rem 1rem;
  }
`;

import React from "react";
// components
import Bio from "./page_components/Bio";
import ProjectList from "./page_components/ProjectList";
import FaqSection from "./page_components/FaqSection";
import SocialLinks from "./page_components/SocialLinks";
import ScrollTop from "../ScrollTop";
// Animations
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";

function AboutMe() {
  return (
    <motion.div variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <Bio />
      <ProjectList />
      <FaqSection />
      <SocialLinks />
      <ScrollTop />
    </motion.div>
  );
}

export default AboutMe;

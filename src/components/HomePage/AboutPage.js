import React from "react";
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";
import Bio from "./page_components/Bio";
import FaqSection from "./page_components/FaqSection";
import SocialLinks from "./page_components/SocialLinks";

function AboutMe() {
  return (
    <motion.div variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <Bio />
      <FaqSection />
      <SocialLinks />
    </motion.div>
  );
}

export default AboutMe;

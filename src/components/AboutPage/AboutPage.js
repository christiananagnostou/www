import React from "react";
// components
import AboutSection from "./page_components/AboutSection";
import MyWork from "../MyWorkPage/MyWork";
import JourneySection from "./page_components/JourneySection";
import FaqSection from "./page_components/FaqSection";
import SocialLinks from "./page_components/SocialLinks";
import ScrollTop from "../ScrollTop";
// Animations
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";

function AboutMe() {
  return (
    <motion.div variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <AboutSection />
      <MyWork />
      <JourneySection />
      <FaqSection />
      <SocialLinks />
      <ScrollTop />
    </motion.div>
  );
}

export default AboutMe;

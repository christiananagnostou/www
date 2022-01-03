import React from "react";
// components
import Hero from "./page_components/Hero";
import LatestBlog from "./page_components/NewestBlog";
import FeaturedProjects from "./page_components/FeaturedProjects";
import MyWork from "./page_components/MyWork";
import JourneySection from "./page_components/JourneySection";
import FaqSection from "./page_components/FaqSection";
import SocialLinks from "./page_components/SocialLinks";
import ScrollTop from "../ScrollTop";
// Animations
import styled from "styled-components";
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";

function HomePage() {
  return (
    <Page variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <Hero />
      <LatestBlog />
      <FeaturedProjects />

      {/* <MyWork />
      <JourneySection />
      <FaqSection />
      <SocialLinks /> */}
      {/* <ScrollTop /> */}
    </Page>
  );
}

export default HomePage;

const Page = styled(motion.div)`
  max-width: 1200px;
  margin: auto;

  & > * {
    border-bottom: 1px solid #c3c3c3;
  }
`;

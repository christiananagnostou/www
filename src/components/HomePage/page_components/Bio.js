import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fade } from "../../../animation";
import Wave from "./Wave";
import { Link } from "react-router-dom";

function Bio() {
  return (
    <StyledSection>
      <Description variants={fade} className="max-w-screen">
        <h1>Christian Anagnostou</h1>

        <motion.p>
          <em>Crafting polished interfaces</em>. Experimenting with subtle details to elevate the
          web experience.
        </motion.p>

        <motion.p>
          I love studying the invisible systems that shape our world. It started (and will forever
          continue) with the web.
        </motion.p>

        <motion.p>
          Currently building websites and apps at{" "}
          <Link to="https://www.electriqmarketing.com/" target={"_blank"}>
            <em>Electriq</em>
          </Link>
        </motion.p>

        <motion.p>
          I spend nearly as much time moving as I do sitting in front of my laptop. Cycling,
          weightlifting, and snowboarding fill those parts of my day. I also dabble with winemaking,
          photography, and learning how to think and write better.
        </motion.p>
      </Description>

      <Wave />
    </StyledSection>
  );
}
export default Bio;

const StyledSection = styled(motion.section)`
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 768px) {
    padding: 5rem 1rem;
  }
`;

const Description = styled(motion.div)`
  flex: 1;
  margin: auto;
  border-radius: 5px;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid var(--accent);
  text-align: left;
  z-index: 2;
  color: #cbcbcb;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  em {
    font-family: var(--font-serif);
    font-weight: 400;
    letter-spacing: 0.03em;
  }

  h1 {
    font-size: 1.2rem;
    font-weight: 200;
    padding: 1rem 0;
  }

  p {
    font-weight: 200;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 1rem 0;
  }

  @media (max-width: 1000px) {
    margin: 2rem 0;
  }
`;

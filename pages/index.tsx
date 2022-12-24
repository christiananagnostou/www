import { motion } from "framer-motion";
import Head from "next/head";
import styled from "styled-components";
import { pageAnimation } from "../components/animation";
import Bio from "../components/Home/Bio";
import SocialLinks from "../components/SocialLinks";

function index() {
  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Bio />
        <SocialLinks />
      </Container>
    </>
  );
}

export default index;

const Container = styled(motion.main)`
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 1rem;

  @media screen and (min-width: 768px) {
    padding: 3rem 1rem;
  }
`;

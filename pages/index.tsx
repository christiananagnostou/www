import { motion } from "framer-motion";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { fade, pageAnimation, staggerFadeFast } from "../components/animation";
import Bio from "../components/Home/Bio";
import SocialLinks from "../components/SocialLinks";

const NumTVBars = 90;

const Sections = ["craft", "imbue", "clarify", "improve", "restart"];

function Home() {
  const [sectionIndex, setSectionIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Bio />

        <TVControls variants={staggerFadeFast}>
          <div className="grill">
            {[...new Array(NumTVBars)].map((_, i) => (
              <TVBar key={i} index={i} variants={fade} />
            ))}
          </div>

          <div className="current-control">
            <motion.span className="label" variants={fade}>
              {Sections.map((section) => (
                <span
                  className="inner"
                  key={section}
                  style={{ display: Sections[sectionIndex] === section ? "block" : "none" }}
                >
                  {Sections[sectionIndex]}
                </span>
              ))}
            </motion.span>

            <motion.button
              variants={fade}
              onClick={() =>
                setSectionIndex((prev) => (prev === 0 ? Sections.length - 1 : prev - 1))
              }
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="16px"
                width="16px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M24 0v24H0V0h24z" opacity=".87"></path>
                <path d="M14 7l-5 5 5 5V7z"></path>
              </svg>
            </motion.button>
            <motion.button
              variants={fade}
              onClick={() =>
                setSectionIndex((prev) => (prev === Sections.length - 1 ? 0 : prev + 1))
              }
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="16px"
                width="16px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M10 17l5-5-5-5v10z"></path>
              </svg>
            </motion.button>
          </div>
        </TVControls>

        <SocialLinks />
      </Container>
    </>
  );
}

export default Home;

const Container = styled(motion.main)`
  max-width: var(--max-w-screen);
  margin: auto;
  padding: 1rem;

  @media screen and (min-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const TVBar = styled(motion.span)<{ index: number }>`
  display: block;
  height: var(--bar-height);
  width: auto;
  position: relative;
  flex: 1;
  margin-right: 4px;

  &:before {
    content: "";
    display: block;
    height: var(--bar-height);
    width: 100%;
    background: var(--accent);
    position: absolute;
    left: 0;
    /* transform: ${({ index }) => `rotate(-${index}deg)`}; */
    border-radius: 1px;
    top: 0;
    opacity: 1;
    animation: lightup ${NumTVBars * 30 * 20 + "ms"} ${({ index }) => index * 30 + "ms"} infinite
      forwards;
  }

  @keyframes lightup {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.5;
    }
  }
`;

const TVControls = styled(motion.div)`
  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: stretch;

  .grill {
    display: flex;
    align-items: center;
    flex: 1;
    --bar-height: 20px;
  }

  .current-control {
    display: flex;
    align-items: stretch;

    .label {
      height: 100%;
      background: rgba(20, 20, 20, 0.5);
      border: 1px solid var(--accent);
      border-radius: 3px;
      padding: 0 1rem;
      min-width: 100px;
      text-align: center;

      .inner {
        color: #888;
        font-weight: 200;
        opacity: 0;
        transition: opacity 0.2s ease;
        animation: fadein 0.5s forwards;
      }

      @keyframes fadein {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }

    button {
      cursor: pointer;
      color: #888;
      background: rgba(20, 20, 20, 0.5);
      border: 1px solid var(--accent);
      border-radius: 3px;
      padding: 0;
      display: grid;
      place-items: center;

      @media screen and (min-width: 768px) {
        margin-left: 4px;
      }

      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

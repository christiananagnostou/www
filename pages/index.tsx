import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { fade, pageAnimation, staggerFadeFast } from "../components/animation";
import Bio from "../components/Home/Bio";
import { useWindowSize } from "../components/Hooks";
import SocialLinks from "../components/SocialLinks";
import LeftArrow from "../components/SVG/LeftArrow";
import RightArrow from "../components/SVG/RightArrow";

const Sections = ["craft", "imbue", "clarify", "improve", "restart"];

function Home() {
  const { width } = useWindowSize();

  const [sectionIndex, setSectionIndex] = useState(0);
  const [numTVBars, setNumTVBars] = useState(90);

  useEffect(() => {
    if (width) setNumTVBars(Math.min(Math.floor(width / 15), 90));
  }, [width]);

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
            {[...new Array(numTVBars)].map((_, i) => (
              <TVBar key={i + "_" + numTVBars} index={i} variants={fade} totalBars={numTVBars} />
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
              <LeftArrow />
            </motion.button>
            <motion.button
              variants={fade}
              onClick={() =>
                setSectionIndex((prev) => (prev === Sections.length - 1 ? 0 : prev + 1))
              }
            >
              <RightArrow />
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

const TVBar = styled(motion.span)<{ index: number; totalBars: number }>`
  display: block;
  height: var(--bar-height);
  width: auto;
  position: relative;
  flex: 1;
  margin-right: var(--item-spacing);

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
    animation: lightup ${({ totalBars }) => totalBars * 30 * 5 + "ms"}
      ${({ index }) => index * 30 + "ms"} infinite forwards;
  }

  @keyframes lightup {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const TVControls = styled(motion.div)`
  --item-spacing: 3.5px;
  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: stretch;

  .grill {
    --bar-height: 20px;
    display: flex;
    align-items: center;
    flex: 1;

    /* background: repeating-linear-gradient(
      to right,
      var(--accent) 0px,
      var(--accent) 2px,
      var(--body-bg) 2px,
      var(--body-bg) 4px
    ); */
  }

  .current-control {
    display: flex;
    align-items: stretch;
    gap: var(--item-spacing);

    .label {
      height: 100%;
      display: grid;
      place-items: center;
      background: rgba(20, 20, 20, 0.5);
      border: 1px solid var(--accent);
      border-radius: 3px;
      padding: 0 1rem;
      min-width: 90px;
      text-align: center;

      .inner {
        color: #888;
        font-weight: 200;
        font-size: 0.9rem;
        line-height: 1rem;

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

      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

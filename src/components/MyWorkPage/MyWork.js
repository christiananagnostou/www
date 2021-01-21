import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
// Images
import lofiwaves from "../../img/lofiwaves-desktop.png";
import spotAList from "../../img/spotalist-desktop.png";
import neologos from "../../img/neologos-desktop2.png";
// Animations
import { motion } from "framer-motion";
import { pageAnimation, fade, photoAnim, lineAnim, slider, sliderContainer } from "../../animation";
import { useScroll } from "../useScroll";
import ScrollTop from "../ScrollTop";

function MyWork() {
  const [element1, controls1] = useScroll();
  const [element2, controls2] = useScroll();
  const [element3, controls3] = useScroll();
  const [styles, setStyles] = useState({ display: "none", background: "#1b1b1b" });

  useEffect(() => {
    setTimeout(() => {
      setStyles({ display: "block", background: "white" });
    }, 750);
  }, [styles.background]);

  return (
    <Work variants={pageAnimation} initial="hidden" animate="show" exit="exit" style={styles}>
      <motion.div variants={sliderContainer}>
        <Frame1 variants={slider} />
        <Frame2 variants={slider} />
        <Frame3 variants={slider} />
        <Frame4 variants={slider} />
      </motion.div>
      <Project ref={element1} variants={fade} animate={controls1} initial="hidden">
        <div>
          <h2>NeoLogos</h2>
          <motion.a
            className="live-link"
            href="https://neologos.herokuapp.com/"
            target="_blank"
            rel="noreferrer"
          >
            Live view
          </motion.a>
        </div>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/neologos">
          <Hide>
            <motion.img variants={photoAnim} src={neologos} alt="goodtimes" />
          </Hide>
        </Link>
      </Project>
      <Project ref={element2} variants={fade} animate={controls2} initial="hidden">
        <div>
          <h2>LofiWaves</h2>
          <motion.a
            className="live-link"
            href="http://lofiwaves.surge.sh/"
            target="_blank"
            rel="noreferrer"
          >
            Live view
          </motion.a>
        </div>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/lofiwaves">
          <Hide>
            <motion.img variants={photoAnim} src={lofiwaves} alt="theracer" />
          </Hide>
        </Link>
      </Project>
      <Project ref={element3} variants={fade} animate={controls3} initial="hidden">
        <div>
          <h2>Spot-A-List</h2>
          <motion.a
            className="live-link"
            href="http://spotalist.surge.sh/"
            target="_blank"
            rel="noreferrer"
          >
            Live view
          </motion.a>
        </div>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/spotalist">
          <Hide>
            <motion.img variants={photoAnim} src={spotAList} alt="athlete" />
          </Hide>
        </Link>
      </Project>
      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  min-height: 100vh;
  overflow: hidden;
  padding: 5rem 8rem;
  color: #4a4a4a;
  h2 {
    padding: 1rem 0;
  }
  @media (max-width: 1500px) {
    padding: 2rem 0rem;
  }
`;
const Project = styled(motion.div)`
  position: relative;
  padding-bottom: 10rem;
  width: 80%;
  margin: auto;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      display: inline-block;
      width: fit-content;
    }
    .live-link {
      display: inline-block;
      width: fit-content;
      color: #4a4a4a;
      text-decoration: none;
      font-size: 1.5rem;
      border: 1px solid #4a4a4a;
      padding: 0.75rem;
      cursor: alias;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: #d8d8d8;
      }
    }
  }
  .line {
    height: 0.5rem;
    background: #fe5a1d;
    margin-bottom: 3rem;
  }
  img {
    width: 100%;
    height: 70vh;
    object-fit: center;
  }
  @media (max-width: 1000px) {
    width: 90%;
    padding-bottom: 5rem;
    div {
      h2 {
        font-size: 3em;
      }
    }
    img {
      height: 50vh;
    }
  }
  @media (max-width: 500px) {
    width: 95%;
    padding-bottom: 10rem;
    div {
      h2 {
        font-size: 2.5em;
      }
    }
    img {
      height: 35vh;
    }
  }
`;

const Hide = styled.div`
  overflow: hidden;
`;

// Frame Animation
const Frame1 = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 10%;
  width: 100%;
  height: 100vh;
  background: #2e2e2e;
  z-index: 2;
`;
const Frame2 = styled(Frame1)`
  background: #676767;
`;
const Frame3 = styled(Frame1)`
  background: #969696;
`;
const Frame4 = styled(Frame1)`
  background: #c7c7c7;
`;

export default MyWork;

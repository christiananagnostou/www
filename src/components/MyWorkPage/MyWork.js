import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
// Images
import athlete from "../../img/athlete-small.png";
import theracer from "../../img/theracer-small.png";
import goodtimes from "../../img/goodtimes-small.png";
// Animations
import { motion } from "framer-motion";
import { pageAnimation, fade, photoAnim, lineAnim, slider, sliderContainer } from "../../animation";
import { useScroll } from "../useScroll";
import ScrollTop from "../ScrollTop";

function MyWork() {
  const [element, controls] = useScroll();
  const [element2, controls2] = useScroll();
  const [styles, setStyles] = useState({ background: "#1b1b1b" });

  useEffect(() => {
    setTimeout(() => {
      setStyles({ background: "white" });
      console.log(styles.background);
    }, 1000);
  }, []);

  return (
    <Work variants={pageAnimation} initial="hidden" animate="show" exit="exit" style={styles}>
      <motion.div variants={sliderContainer}>
        <Frame1 variants={slider} />
        <Frame2 variants={slider} />
        <Frame3 variants={slider} />
        <Frame4 variants={slider} />
      </motion.div>
      <Movie>
        <motion.h2 variants={fade}>Jamming</motion.h2>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/the-athlete">
          <Hide>
            <motion.img variants={photoAnim} src={athlete} alt="athlete" />
          </Hide>
        </Link>
      </Movie>
      <Movie ref={element} variants={fade} animate={controls} initial="hidden">
        <h2>LofiWaves</h2>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/the-racer">
          <img src={theracer} alt="theracer" />
        </Link>
      </Movie>
      <Movie ref={element2} variants={fade} animate={controls2} initial="hidden">
        <h2>Good Times</h2>
        <motion.div variants={lineAnim} className="line"></motion.div>
        <Link to="/work/good-times">
          <img src={goodtimes} alt="goodtimes" />
        </Link>
      </Movie>
      <ScrollTop />
    </Work>
  );
}

const Work = styled(motion.div)`
  min-height: 100vh;
  overflow: hidden;
  padding: 5rem 10rem;
  color: #4a4a4a;
  h2 {
    padding: 1rem 0;
  }
  @media (max-width: 1300px) {
    padding: 2rem;
  }
`;
const Movie = styled(motion.div)`
  padding-bottom: 10rem;
  .line {
    height: 0.5rem;
    background: #fe5a1d;
    margin-bottom: 3rem;
  }
  img {
    width: 100%;
    height: 70vh;
    object-fit: cover;
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

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import profileImg from "../../../img/profile-img.jpeg";
// Framer Motion
import { motion } from "framer-motion";
import { fade } from "../../../animation";
import Wave from "./Wave";

function AboutSection() {
  return (
    <StyledSection>
      <StyledInfo variants={fade}>
        <Image>
          <img src={profileImg} alt="home profile" />
        </Image>

        <div className="info">
          <div className="bullet">
            <p>📍 Location</p>
            <code>Bay Area</code>
          </div>
          {/* <div className="bullet">
            <p>👨‍💻 Available</p>
            <code>Yes</code>
          </div> */}
          <div className="bullet">
            <p>🚧 Building</p>
            <code>
              <a href="https://liftclub.app" target="_blank" rel="noreferrer">
                Lift Club
              </a>
            </code>
          </div>
        </div>
      </StyledInfo>

      <Description variants={fade}>
        <h3>Hi, I'm Christian</h3>

        <motion.p variants={fade}>
          I love studying the invisible systems that shape our world. It started (and will forever
          continue) with the web.
        </motion.p>

        <motion.p variants={fade}>
          I spend nearly as much time moving as I do sitting in front of my laptop. Biking, hiking,
          weightlifting, and snowboarding fill those parts of my day.
        </motion.p>

        <motion.p variants={fade}>
          Other interests include winemaking, photography, decentralized finance, and learning how
          to think and write better.
        </motion.p>

        <motion.p variants={fade}>
          For work inquiries, <Link to="/contact">email</Link> is best. For everything else, pick
          your poison. I'm happy to correspond about any of my interests — or something you think
          I'd find interesting.
        </motion.p>
      </Description>

      <Wave />
    </StyledSection>
  );
}
export default AboutSection;

const StyledSection = styled(motion.div)`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 5rem 10rem 10rem;

  p {
    padding: 0.5rem 2rem;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 2rem 6rem;
  }
  @media (max-width: 700px) {
    padding: 1rem;
    p {
      padding: 0.5rem 1rem;
    }
  }
`;

const StyledInfo = styled(motion.aside)`
  width: 100%;
  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #4769ff;
  flex: 0.5;
  display: flex;
  flex-direction: column;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    margin-top: 3rem;

    .bullet {
      display: flex;
      align-items: center;
      margin: 0.75rem 0;
      width: 50%;

      p,
      code {
        padding: 0.1rem 0;
        color: #ccc;
        min-width: max-content;
        font-size: 1.1rem;
      }

      p {
        color: #adadad;
      }
      code {
        flex: 1;
        color: #cbcbcb;
        margin-left: 1rem;
      }
    }
  }

  @media (max-width: 1000px) {
    padding: 1rem;
    flex: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .info {
      max-width: 250px;
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 0.25rem 0;
      justify-content: flex-start;
      align-items: stretch;

      .bullet {
        flex: 1;
        flex-direction: row;

        p,
        code {
          font-size: 1.1rem;
        }
      }
    }
  }
`;

const Image = styled.div`
  overflow: hidden;
  margin: auto;
  z-index: 2;
  width: 26vh;
  height: 26vh;
  border-radius: 50%;
  border: 2px solid #4769ff;

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 1200px) {
    width: 22vh;
    height: 22vh;
  }
  @media (max-width: 800px) {
    width: 15vh;
    height: 15vh;
  }
  @media (max-width: 500px) {
    width: 12vh;
    height: 12vh;
    min-width: 12vh;
    min-height: 12vh;
  }
`;

const Description = styled(motion.div)`
  flex: 1;
  border-radius: 10px;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #4769ff;
  text-align: left;
  margin: 0 3rem;
  z-index: 2;
  color: #cbcbcb;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  h3 {
    font-weight: 400;
    font-size: 1.75rem;
    margin-left: 2rem;
  }

  p {
    font-weight: 200;
    font-size: 1.2rem;
    line-height: 2rem;
  }

  @media (max-width: 1000px) {
    margin: 2rem 0;

    h3 {
      margin-left: 1rem;
    }
  }
`;

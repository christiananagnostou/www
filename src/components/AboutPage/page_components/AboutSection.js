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
            <code>San Fran</code>
          </div>

          <div className="bullet">
            <p>👨‍💻 Available</p>
            <code>Yes</code>
          </div>

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
        <p>
          <span>Hi, I'm Christian</span>
        </p>

        <motion.p variants={fade}>
          I love studying the invisible systems that shape our world. It started (and will forever
          continue) with the web. Recently, my curiousity has extended to financial systems.
        </motion.p>

        <motion.p variants={fade}>
          I spend nearly as much time moving as I do sitting in front of my laptop. Biking,
          weightlifting, snowboarding, hiking fill those parts of my day.
        </motion.p>

        <motion.p variants={fade}>
          Other interests include winemaking, photography, personal finance, and learning how to
          think and write better.
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
  min-height: 90vh;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 5rem 10rem 10rem;

  p {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 2rem 6rem;
    text-align: center;
  }
  @media (max-width: 700px) {
    padding: 2rem;
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

    .bullet {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      margin: 0.75rem 0;

      p,
      code {
        padding: 0.1rem 0;
        color: #ccc;
        min-width: max-content;
        font-size: 1.4rem;
        line-height: 150%;
      }

      p {
        color: #adadad;
      }
      code {
        margin-left: 2rem;
        color: #cbcbcb;
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
      flex: 0.75;
      display: flex;
      flex-direction: column;
      margin: 0.25rem 0;
      justify-content: flex-start;
      align-items: stretch;

      .bullet {
        flex: 1;
        flex-direction: row;

        p {
          font-size: 1.2rem;
          flex: 1;
          margin-right: 1rem;
        }
        code {
          font-size: 1.2rem;
          flex: 1;
          text-align: left;
          margin: 0;
        }
      }
    }
  }
`;

const Image = styled.div`
  overflow: hidden;
  margin: auto;
  z-index: 2;
  width: 30vh;
  height: 30vh;
  border-radius: 50%;
  border: 2px solid #4769ff;

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 1000px) {
    width: 22.5vh;
    height: 22.5vh;
    margin: 0;
  }
  @media (max-width: 600px) {
    width: 15vh;
    height: 15vh;
  }
  @media (max-width: 500px) {
    width: 12vh;
    height: 12vh;
    margin-right: 1rem;
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

  @media (max-width: 1000px) {
    margin: 3rem 0;
  }
`;

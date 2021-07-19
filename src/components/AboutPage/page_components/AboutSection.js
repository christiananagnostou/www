import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import profileImg from "../../../img/profile-img.jpg";
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
            <code>
              <p>San Francisco</p>
            </code>
          </div>

          <div className="bullet">
            <p>👨‍💻 Available</p>
            <code>
              <p>Yes</p>
            </code>
          </div>

          <div className="bullet">
            <p>🚧 Building</p>
            <code>
              <p>
                <a href="https://workout-logger-omega.vercel.app" target="_blank" rel="noreferrer">
                  ALC
                </a>
              </p>
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
          For work inquiries,{" "}
          <Link to="/contact">
            <a href="#">email</a>
          </Link>{" "}
          is best. For everything else, pick your poison. I'm happy to correspond about any of my
          interests — or something you think I'd find interesting.
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

    .bullet {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: left;
      margin: 0.75rem 0;

      p,
      code {
        width: 70%;
        min-width: max-content;
        flex: 1;
        padding: 0.1rem 0;
      }

      p {
        color: #adadad;
      }
      code p {
        margin-left: 2rem;
        color: #cbcbcb;
      }
    }
  }

  @media (max-width: 1000px) {
    flex: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .info {
      .bullet {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.25rem 0;

        p,
        code {
          width: 100%;
          flex: 0;
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
    margin: auto;
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

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
          <p>
            <span>📍</span> Location
          </p>
          <code>SF Bay Area</code>

          <p>
            <span>👨‍💻</span> Works @
          </p>
          <code>
            <a href="https://www.drinks.com/" target="_blank" rel="noreferrer">
              DRINKS
            </a>
          </code>

          <p>
            <span>🚧</span> var currProj =
          </p>

          <code>
            <a href="https://liftclub.app" target="_blank" rel="noreferrer">
              Lift Club
            </a>
          </code>
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
  flex: 0.3;
  display: flex;
  flex-direction: column;

  .info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 3rem auto 0;

    p,
    code {
      padding: 0.1rem 0;
      color: #ccc;
      min-width: max-content;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
    }
    p {
      color: #adadad;
      span {
        font-size: 0.8rem;
        margin-right: 0.5rem;
      }
    }
    code {
      color: #cbcbcb;
      margin-left: 1rem;
    }
  }

  @media (max-width: 1000px) {
    padding: 1rem;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    .info {
      max-width: 250px;
      margin: 0.25rem 0 0.25rem 3rem;

      p,
      code {
        font-size: 1.1rem;
      }
    }
  }
`;

const Image = styled.div`
  overflow: hidden;

  img {
    margin: auto;
    border-radius: 50%;
    border: 2px solid #4769ff;
    display: block;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;

    @media (max-width: 1200px) {
      max-width: 150px;
      max-height: 150px;
    }
    @media (max-width: 800px) {
      max-width: 100px;
      max-height: 100px;
    }
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
  }

  p {
    font-weight: 200;
    font-size: 1.2rem;
    line-height: 2rem;
    padding: 0.5rem 0;
  }

  @media (max-width: 1000px) {
    margin: 2rem 0;
  }
`;

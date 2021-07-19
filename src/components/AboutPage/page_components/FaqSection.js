import React from "react";
// Styles
import styled from "styled-components";
import Toggle from "./Toggle";
import { AnimateSharedLayout } from "framer-motion";
// Animation
import { useScroll } from "../../useScroll";
import { fade } from "../../../animation";
import { motion } from "framer-motion";

function FaqSection() {
  const [element, controls] = useScroll();

  return (
    <Faq variants={fade} animate={controls} initial="hidden" ref={element}>
      <h2>
        <span>Extras</span>
      </h2>
      <AnimateSharedLayout>
        {/* <Toggle title="Why teach yourself?">
          <div className="answer">
            <p>
              <span>The choices:</span> College, Bootcamps, and Self-Taught
            </p>
            <p>
              So obviously I chose the <span>self-taught</span> route. Why? Ok, I'll break it down
              for ya. I've loved working with my computer my whole life and coding has always been a
              creative outlet for me. After graduating college with a degree in Business Admin, I
              was accepted to a coding bootcamp, but before accepting, I told myself that if I
              really wanted to do this, I should be committed enough to teach myself whatever I
              needed to know. The challenge was on...
            </p>
          </div>
        </Toggle> */}
        <Toggle title="What have I been working on lately?">
          <div className="answer">
            <p>
              Lately, I've been working on a project called <span>Anagnostou Lift Club</span>; a
              workout-tracking, social fitness app intended to bridge the gap between physical
              trainers and clients.
            </p>
            <p>
              Users are able to create exercises or choose from a plethora of pre-made ones, add
              them to a customizable workout, and share them with a community of other fitness
              junkies. This is aimed at allowing anyone to be their own workout trainer. Not only
              can you share workouts, but you can track your progress to see your gains as you get
              faster and stronger.
            </p>
          </div>
        </Toggle>
        <Toggle title="What's next on the list to learn?">
          <div className="answer">
            <p>
              <span>Blockchain</span> and <span>Solidity</span>.
            </p>
            <p>
              Having a solid understanding of website and web app development, I am working to
              expand my horizons by learning how to interact with the Ethereum blockchain.
              Currently, I am auditing a blockchain and economics course from MIT and working
              through a class on programming in Solidity and Web3.js.
            </p>
          </div>
        </Toggle>
        <Toggle title="What helped you on your journey to become self-taught?">
          <div className="answer">
            <p>
              First off, endless <span>motivation</span>, mostly music-induced, in combination with
              lots of <span>coffee</span>. I started out jumping around with a few different
              languages before I realized that I needed something with a direct visual output. With
              that in mind, I signed up for <span>Codecademy</span>, learned HTML and CSS, and built
              TONS of cool looking pages...well I thought they looked cool at the time. After that,
              I marched on into JavaScript and made some simple games and brought functionality to
              my "cool looking" web pages. From there, I read a lot of forum posts,
              <span> stack overflow</span>, blogs, and countless developer docs on how build with
              and new tools. Other than that, <span>YouTube</span> was and continues to be a great
              resource for everything from the technical aspects of code to the inspirations for my
              next project.
            </p>
          </div>
        </Toggle>
      </AnimateSharedLayout>
    </Faq>
  );
}

const Faq = styled(motion.secion)`
  align-items: center;
  justify-content: space-between;
  padding: 2rem 10rem;
  display: block;
  color: #fff;


  p {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }

  h2 {
    padding-bottom: 2rem;
    font-weight: lighter;
  }
  .faq-line {
    background: #ccc;
    height: 0.2rem;
    margin: 2rem 0;
    width: 100%;
  }
  .question {
    padding: 1rem 0;
    cursor: pointer;
  }
  .answer {
    padding: 2rem 0;
    p {
      padding: 1rem 0;
    }
  }

  a {
    color: white;
    font-family: inherit;
    font-size: inherit;
  }
`;

export default FaqSection;

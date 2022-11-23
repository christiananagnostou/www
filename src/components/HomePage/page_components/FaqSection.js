import React from "react";
import styled from "styled-components";
import { AnimateSharedLayout } from "framer-motion";
import { motion } from "framer-motion";
import Toggle from "./Toggle";
import { fade } from "../../../animation";

function FaqSection() {
  return (
    <Faq variants={fade}>
      <AnimateSharedLayout>
        <Toggle title="What have I been working on lately?">
          <div className="answer">
            <p>
              Lately, I've been working on an app called <span>Lift Club</span>; a workout-tracking,
              social fitness app intended to bridge the gap between physical trainers and clients.
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

const Faq = styled(motion.section)`
  padding: 1rem;
  display: block;
  max-width: var(--max-w-screen);
  margin: auto;

  p {
    padding: 1rem;
  }

  .faq-line {
    background: var(--accent);
    height: 1px;
    margin: 1rem 0;
    width: 100%;
  }
  .question {
    cursor: pointer;
    font-size: 1rem;
    color: var(--heading);
    font-weight: 400;
  }
  .answer {
    color: var(--text);
    padding: 1rem 0 0;
    p {
      padding: 1rem 0;
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  a {
    color: var(--heading);
    font-family: inherit;
    font-size: inherit;
  }
`;

export default FaqSection;

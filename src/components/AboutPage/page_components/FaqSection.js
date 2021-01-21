import React, { useState } from "react";
// Styles
import styled from "styled-components";
import { About } from "../../styles";
import Toggle from "./Toggle";
import { AnimateSharedLayout } from "framer-motion";
// Animation
import { useScroll } from "../../useScroll";
import { scrollReveal } from "../../../animation";

function FaqSection() {
  const [element, controls] = useScroll();

  return (
    <Faq variants={scrollReveal} animate={controls} initial="hidden" ref={element}>
      <h2>
        <span>Extras</span>
      </h2>
      <AnimateSharedLayout>
        <Toggle title="Why teach yourself?">
          <div className="answer">
            <p>
              <span>The choices:</span> College, Bootcamps, and Self-Taught
            </p>
            <p>
              So obviously I chose the <span>self-taught</span> route. Why? Ok, I'll break it down
              for ya. If you're gonna commit to being a programmer, what is the one thing you need
              to get used to doing all the time? Learning! So if I was going to be committedto this
              journey, why not make it as hard as possible so that I could become better at teaching
              myself new material.
            </p>
          </div>
        </Toggle>
        <Toggle title="What language you workin' with these days?">
          <div className="answer">
            <p>
              I fell in love with <span>React</span> from the minute I started learning about it, so
              I primarially use that.
            </p>
            <p>
              The simple approach and speed behind React is the reason why I specialized in it. With
              the lifecycle methods, and now hooks, controling components and interacting with the
              DOM becomes a breeze. Having the ability to create reusableUI components and functions
              just makes life so much easier.
            </p>
          </div>
        </Toggle>
        <Toggle title="What's next on the list to learn?">
          <div className="answer">
            <p>
              More about <span>React</span> and <span>Redux</span>.
            </p>
            <p>
              Mastery is a big word, so I won't use it, but I do plan on continuing to improve my
              work with React to a much, much greater degree.
            </p>
          </div>
        </Toggle>
        <Toggle title="What helped you on your journey to become self-taught?">
          <div className="answer">
            <p>The internet!</p>
            <p>
              First off, endless <span>motivation</span>, mostly music-induced, in combination with
              lots of <span>coffee</span>! I started out jumping around with a few different
              languages before I realized that I needed something with a direct visual output. So
              with that in mind, I signed up for <span>Codecademy</span> and learned HTML, then CSS,
              and built TONS of cool looking pages...well I thought they looked cool at the time.
              After that, I marched on into JavaScript and made some simple games and brought
              functionality to my "cool looking" web pages. I basically went through the Web
              Development path on CodecademyPro to learned the basics of Git, Command Line, HTML,
              CSS, JS, Node.js, and React. From there, I read a lot of forum posts,{" "}
              <span>stack overflow</span> posts, blogs, and developer notes on how to use React.
              Other than that, <span>YouTube</span> was and continues to be a great resource for
              everything from the technical aspects of language patterns to the inspirations for my
              next project.
            </p>
          </div>
        </Toggle>
      </AnimateSharedLayout>
    </Faq>
  );
}

const Faq = styled(About)`
  display: block;
  color: #fff;
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
`;

export default FaqSection;

import React from "react";
// import icons
import html5Logo from "../../../img/html5-logo.svg";
import css3Logo from "../../../img/css3-logo.svg";
import reactLogo from "../../../img/react-logo.svg";
import jsLogo from "../../../img/js-logo.svg";
import nextjsLogo from "../../../img/nextjs-logo.svg";
import solidityLogo from "../../../img/solidity-logo.svg";
import gitLogo from "../../../img/git-logo.svg";
// Styles
import styled from "styled-components";
import { About, Description } from "../../styles";
// Animation
import { fade } from "../../../animation";
import { useScroll } from "../../useScroll";

const icons = [html5Logo, css3Logo, jsLogo, reactLogo, gitLogo, nextjsLogo, solidityLogo];

function JourneySection() {
  const [element, controls] = useScroll();

  return (
    <About variants={fade} animate={controls} initial="hidden" ref={element}>
      <Description>
        <h2>
          In the <span>toolbelt</span>
        </h2>

        <Icons>
          {icons.map((icon) => (
            <Icon>
              <div className="icon">
                <img src={icon} alt="icon" />
              </div>
            </Icon>
          ))}
        </Icons>
      </Description>

      <Bio>
        <h2>
          My journey as a <span>developer</span>.
        </h2>
        <p>
          I was first introduced to programming in highschool in my AP computer science class. From
          making sudoku in the command line to a working through dense algorithms, I loved it all.
          Why I didn't choose CS as my major is beyond me, but I never forgot the feeling of
          compiling my code and seeing my hard work come to life!
          <br />
          <br />
          Fast forward a couple of years to the end of college, I found myself working on buffing up
          the website for a winery I had been working at. It was just a Squarespace website, but it
          reminded me of my programming days. That experience motivated me to put every ounce of
          effort into honing my coding skills so that I could have a career centered around
          programming. Here I am, one year later, and I'm doing what I love...building on the web.
          Best part is, the journey has only just begun.
        </p>
      </Bio>
    </About>
  );
}

const Icons = styled.div`
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  max-width: 700px;
  @media (max-width: 1300px) {
    justify-content: center;
    gap: 25px;
    max-width: 500px;
    margin: auto;
  }
`;
const Icon = styled.div`
  .icon {
    display: flex;
    align-items: center;
  }
`;

const Bio = styled.div`
  margin: auto;
  width: 60%;
  padding-left: 15px;
  h2 {
    color: #ccc;
  }
  p {
    line-height: 2.2rem;
  }
  @media (max-width: 1300px) {
    border-left: none;
    padding-left: 0;
    padding-top: 15px;
    border-top: 5px solid #ccc;
    margin-top: 5rem;
    width: 90%;
  }
`;

export default JourneySection;

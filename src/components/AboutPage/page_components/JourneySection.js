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

function JourneySection() {
  const [element, controls] = useScroll();

  return (
    <About variants={fade} animate={controls} initial="hidden" ref={element}>
      <Description>
        <h2>
          In the <span>toolbelt</span>
        </h2>
        <Cards>
          <Card>
            <div className="icon">
              <img src={html5Logo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={css3Logo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={jsLogo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={reactLogo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={gitLogo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={nextjsLogo} alt="icon" />
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={solidityLogo} alt="icon" />
            </div>
          </Card>
        </Cards>
      </Description>

      <Bio>
        <h2>
          My journey as a <span>developer</span>.
        </h2>
        <p>
          I was first introduced to coding in an AP computer science class in high school. The drive
          to be in the software industry was sparked right then and there. I went on to take some
          college level computer science classes, but ended up majoring in business administration.
          During that time, I found myself comparing every job I had to the thought of being a
          software developer.
          <br />
          <br />
          Fast forward to July 2020, I decided to take action on those thoughts and dive head-first
          into becoming a software developer. After countless hours of reading developer
          documentation, following online courses, and banging away on projects of my own, I think
          it's safe to say that I've learned a thing or two.
          <br />
          <br />
          <span>Learning</span> something new every day has been the key to my success!
        </p>
      </Bio>
    </About>
  );
}

const Cards = styled.div`
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
const Card = styled.div`
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

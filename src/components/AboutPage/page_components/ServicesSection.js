import React from "react";
// import icons
import html5Logo from "../../../img/html5-logo.svg";
import css3Logo from "../../../img/css3-logo.svg";
import reactLogo from "../../../img/react-logo.svg";
import jsLogo from "../../../img/js-logo.svg";
import phoneLogo from "../../../img/mobile-logo.svg";
import gitLogo from "../../../img/git-logo.svg";
// Styles
import styled from "styled-components";
import { About, Description } from "../../styles";
// Animation
import { fade } from "../../../animation";
import { useScroll } from "../../useScroll";

function ServicesSection() {
  const [element, controls] = useScroll();

  return (
    <Services variants={fade} animate={controls} initial="hidden" ref={element}>
      <Description>
        <h2>
          In the <span>toolbelt</span>
        </h2>
        <Cards>
          <Card>
            <div className="icon">
              <img src={html5Logo} alt="icon" />
              <h3>HTML5</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={css3Logo} alt="icon" />
              <h3>CSS3</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={jsLogo} alt="icon" />
              <h3>JavaScript</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={reactLogo} alt="icon" />
              <h3>React</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={gitLogo} alt="icon" />
              <h3>Git</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={phoneLogo} alt="icon" />
              <h3>Responsive Design</h3>
            </div>
          </Card>
        </Cards>
      </Description>
      <Bio>
        <h2>
          Everyone has a <span>story.</span>
          <br />
          So here's mine...
        </h2>
        <p>
          I started learning how to code back in <span>high school</span> in my AP Computer Science
          class. Once we hit OOP, I <span>struggled</span> big time! I went on to get a degree in
          Business Administration to be a businessman! Yay...I mean yikes.
          <br />
          <br />
          Fast forward to <span>August 2020</span>, I decided to dive head first into becoming a{" "}
          <span>software developer</span> while I sat at home during quarantine. After countless
          hours of reading language documentation, watching YouTube guides, and banging away on my
          own projects, I think it's safe to say that I've learned a thing or two and I{" "}
          <span>couldn't be happier</span> with how far I've come.
          <br />
          <br />
          Want to know the best part? The <span>learning</span> has only just begun!
        </p>
      </Bio>
    </Services>
  );
}

const Services = styled(About)`
  h2 {
    padding-bottom: 5rem;
  }
`;
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
  flex-basis: 15rem;
  .icon {
    display: flex;
    align-items: center;
    h3 {
      width: min-content;
      margin-left: 1rem;
      background: #ddd;
      color: black;
      padding: 1rem;
    }
  }
`;

const Bio = styled.div`
  margin: auto;
  width: 60%;
  border-left: 5px solid #ccc;
  border-radius: 5px;
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

export default ServicesSection;

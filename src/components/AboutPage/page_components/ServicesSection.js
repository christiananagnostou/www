import React from "react";
// import icons
import clock from "../../../img/clock.svg";
import diaphragm from "../../../img/diaphragm.svg";
import money from "../../../img/money.svg";
import teamwork from "../../../img/teamwork.svg";
import home2 from "../../../img/home2.png";
// Styles
import styled from "styled-components";
import { About, Description, Image } from "../../styles";
// Animation
import { fade } from "../../../animation";
import { useScroll } from "../../useScroll";

function ServicesSection() {
  const [element, controls] = useScroll();

  return (
    <Services variants={fade} animate={controls} initial="hidden" ref={element}>
      <Description>
        <h2>
          What I <span>value</span> most.
        </h2>
        <Cards>
          <Card>
            <div className="icon">
              <img src={clock} alt="icon" />
              <h3>My Time</h3>
            </div>
          </Card>

          <Card>
            <div className="icon">
              <img src={diaphragm} alt="icon" />
              <h3>Creativity</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={money} alt="icon" />
              <h3>Value</h3>
            </div>
          </Card>
          <Card>
            <div className="icon">
              <img src={teamwork} alt="icon" />
              <h3>Communication</h3>
            </div>
          </Card>
        </Cards>
      </Description>
      <Bio>
        <h2>
          Everyone has a story.
          <br />
          So here's mine...
        </h2>
        <p>
          I started learning how to code back in <span>high school</span> in my AP Computer Science
          class. Once we hit OOP, I <span>struggled</span> big time! I went on to get a degree in
          Business Administration to be a businessman! Yay...I mean yikes.
          <br />
          <br />
          Fast forward to my <span>24th birthday</span>, I decided to dive head first into becoming
          a <span>software developer</span> while I sat at home during quarantine. After countless
          hours of reading language documentation, watching YouTube guides, and banging away on my
          own projects, I think it's safe to say that I've learned a thing or two.
          <br />
          <br />
          Want to know the best part? The <span>learning</span> has just begun.
        </p>
      </Bio>
    </Services>
  );
}

const Services = styled(About)`
  h2 {
    padding-bottom: 5rem;
  }
  /* p {
    width: 70%70vh;
    padding: 2rem 0 4rem 0;
  } */
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
      margin-left: 1rem;
      background: white;
      color: black;
      padding: 1rem;
    }
  }
`;

const Bio = styled.div`
  margin: auto;
  width: 60%;
  border-left: 5px solid white;
  border-radius: 5px;
  padding-left: 15px;
  h2 {
    color: white;
  }
  p {
    line-height: 2.2rem;
  }
  @media (max-width: 1300px) {
    border-left: none;
    padding-left: 0;
    padding-top: 15px;
    border-top: 5px solid white;
    margin-top: 5rem;
    width: 90%;
  }
`;

export default ServicesSection;

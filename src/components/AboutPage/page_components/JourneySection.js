import React from "react";
// import icons
import html5Logo from "../../../img/html5-logo.svg";
import css3Logo from "../../../img/css3-logo.svg";
import reactLogo from "../../../img/react-logo.svg";
import jsLogo from "../../../img/js-logo.svg";
import nextjsLogo from "../../../img/nextjs-logo.svg";
import gitLogo from "../../../img/git-logo.svg";
// Styles
import styled from "styled-components";
// Animation
import { fade } from "../../../animation";
import { useScroll } from "../../useScroll";
import { motion } from "framer-motion";

const icons = [html5Logo, css3Logo, jsLogo, reactLogo, gitLogo, nextjsLogo];

function JourneySection() {
  const [element, controls] = useScroll();
  const [element2, controls2] = useScroll();

  return (
    <StyledSection>
      <ToolsTile variants={fade} animate={controls} initial="hidden" ref={element}>
        <h2>
          In the <span>toolbelt</span>
        </h2>
        <Icons>
          {icons.map((icon, i) => (
            <Icon ley={i}>
              <div className="icon">
                <img src={icon} alt="icon" />
              </div>
            </Icon>
          ))}
        </Icons>
      </ToolsTile>

      <Bio variants={fade} animate={controls2} initial="hidden" ref={element2}>
        <h2>
          My journey as a <span>developer</span>.
        </h2>
        <p>
          I was first introduced to programming in highschool in my AP computer science class. From
          making sudoku in the command line to working through dense algorithms, I loved it all and
          never forgot the feeling seeing my hard work come to life.
          <br />
          <br />
          Fast forward a couple of years to the end of college, I found myself working on buffing up
          the website for a winery I had been working at and it reminded me of my programming days.
          That experience motivated me to put every ounce of effort into honing my coding skills.
          Here I am, doing what I love...building on the web. Best part is, the journey has only
          just begun.
        </p>
      </Bio>
    </StyledSection>
  );
}
export default JourneySection;

// Styled Component
export const StyledSection = styled.section`
  min-height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 5rem;

  p {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }
`;

const ToolsTile = styled(motion.div)`
  flex: 0.5;
  color: #cbcbcb;
  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #4769ff;
  margin-right: 5rem;

  h2 {
    text-align: center;
  }

  @media (max-width: 1000px) {
    margin: 0 auto 3rem;
  }
`;

const Icons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;

  @media (max-width: 1300px) {
    margin: auto;
  }
  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
const Icon = styled.div`
  margin: 1rem 2rem;
  .icon {
    display: flex;
    align-items: center;
  }
  @media (max-width: 800px) {
    margin: 1rem 1rem;
  }
`;

const Bio = styled(motion.div)`
  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #4769ff;
  margin: auto;
  flex: 1.5;
  text-align: left;

  h2 {
    color: #ccc;
  }
  p {
    line-height: 2.2rem;
  }
`;

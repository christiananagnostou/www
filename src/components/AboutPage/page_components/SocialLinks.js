import React from "react";
// Icons
import instagram from "../../../img/instagram.svg";
import github from "../../../img/github.svg";
import linkedin from "../../../img/linkedin.svg";
// Animations
import styled from "styled-components";
import { motion } from "framer-motion";

function SocialLinks() {
  return (
    <SocialLinkList>
      <li>
        <a href="https://github.com/ChristianAnagnostou" target="_blank" rel="noreferrer">
          <img src={instagram} alt="instagram" className="social-icon" />
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/ChristianAnagnostou/" target="_blank" rel="noreferrer">
          <img src={linkedin} alt="linkedin" className="social-icon" />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/christian.anagnostou/" target="_blank" rel="noreferrer">
          <img src={github} alt="github" className="social-icon" />
        </a>
      </li>
    </SocialLinkList>
  );
}

const SocialLinkList = styled(motion.ul)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 10vh;
  list-style: none;
  a {
    .social-icon {
      margin: 0 1rem;
      height: 2.5rem;
      cursor: pointer;
      &:hover {
        color: #fe5a1d;
      }
    }
  }
`;

export default SocialLinks;

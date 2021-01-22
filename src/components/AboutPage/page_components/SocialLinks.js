import React from "react";
// Icons
import { GitHub, LinkedIn, Instagram } from "@material-ui/icons";
// Animations
import styled from "styled-components";
import { motion } from "framer-motion";

function SocialLinks() {
  return (
    <SocialLinkList>
      <li>
        <a href="https://github.com/ChristianAnagnostou" target="_blank" rel="noreferrer">
          <GitHub className="social-icon" />
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/ChristianAnagnostou/" target="_blank" rel="noreferrer">
          <LinkedIn className="social-icon" />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/christian.anagnostou/" target="_blank" rel="noreferrer">
          <Instagram className="social-icon" />
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
    color: white;
    .social-icon {
      font-size: 2.5rem;
      cursor: pointer;
      &:hover {
        color: #fe5a1d;
      }
    }
  }
`;

export default SocialLinks;

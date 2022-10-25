import React from "react";
// Animations
import styled from "styled-components";
import { motion } from "framer-motion";
import { fade } from "../../../animation";
// Icons
import Instagram from "../../../img/Instagram";
import Gitgub from "../../../img/GitHub";
import LinkedIn from "../../../img/LinkedIn";

function SocialLinks() {
  return (
    <SocialLinkList variants={fade}>
      <li>
        <a href="https://github.com/ChristianAnagnostou" target="_blank" rel="noreferrer">
          <Gitgub />
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/ChristianAnagnostou/" target="_blank" rel="noreferrer">
          <LinkedIn />
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/christian.anagnostou/" target="_blank" rel="noreferrer">
          <Instagram />
        </a>
      </li>
    </SocialLinkList>
  );
}

const SocialLinkList = styled(motion.ul)`
  width: fit-content;
  margin: 1rem auto 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;

  border-radius: 5px;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid var(--accent);

  li {
    margin: 0 1rem;

    a {
      display: block;
    }
    a[href]:not(:hover) path {
      fill: #bbb !important;
    }
  }
`;

export default SocialLinks;

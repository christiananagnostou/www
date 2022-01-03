import React from "react";
// Icons
import Instagram from "../../../img/Instagram";
import Gitgub from "../../../img/GitHub";
import LinkedIn from "../../../img/LinkedIn";
// Animations
import styled from "styled-components";
import { motion } from "framer-motion";
import { fade } from "../../../animation";
import { useScroll } from "../../useScroll";

function SocialLinks({ flexDirection = "row" }) {
  const [element, controls] = useScroll();

  return (
    <SocialLinkList
      style={{ flexDirection: flexDirection }}
      ref={element}
      variants={fade}
      animate={controls}
      initial="hidden"
    >
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

  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 2px solid #6da5ea;
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

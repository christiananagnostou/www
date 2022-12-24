// Animations
import { motion } from "framer-motion";
import styled from "styled-components";
import { fade } from "./animation";
import Github from "./SVG/GitHub";
import Instagram from "./SVG/Instagram";
import LinkedIn from "./SVG/LinkedIn";
import Readcv from "./SVG/Readcv";

function SocialLinks() {
  return (
    <SocialLinkList variants={fade}>
      <li>
        <a href="https://github.com/ChristianAnagnostou" target="_blank" rel="noreferrer">
          <Github />
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
      <li>
        <a href="https://read.cv/christian.a" target="_blank" rel="noreferrer">
          <Readcv />
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
  padding: 0.6rem 0 0.45rem;
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid var(--accent);

  li {
    margin: 0 0.75rem;
    flex: 1;

    a {
      display: block;
      color: var(--accent);

      &:hover {
        color: #fff;
      }
    }
  }
`;

export default SocialLinks;

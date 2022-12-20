import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { fade } from "../../animation";
import { useScroll } from "../useScroll";

const Image = ({ src }) => {
  const [element, controls] = useScroll();

  return <Img src={src} variants={fade} ref={element} animate={controls} initial="hidden" />;
};

export default Image;

const Img = styled(motion.img)`
  display: block;
  max-width: 100%;
  border-radius: 5px;
`;

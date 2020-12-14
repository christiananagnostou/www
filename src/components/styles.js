import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Component
export const About = styled(motion.div)`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rem 10rem;
  @media (max-width: 1300px) {
    display: block;
    padding: 2rem;
    text-align: center;
  }
`;

export const Description = styled.div`
  flex: 1;
  padding-right: 5rem;
  z-index: 2;
  color: #cbcbcb;
  h2 {
    font-weight: lighter;
  }
  @media (max-width: 1300px) {
    padding: 0;
    button {
      margin: 2rem 0rem 5rem;
    }
  }
`;

export const Image = styled.div`
  flex: 1;
  overflow: hidden;
  z-index: 2;
  img {
    width: 100%;
    height: 75vh;
    object-fit: cover;
  }
  @media (max-width: 1300px) {
    img {
      width: 80%;
      height: 65vh;
    }
  }
  @media (max-width: 700px) {
    img {
      width: 100%;
      height: 50vh;
    }
  }
`;

export const Hide = styled.div`
  overflow: hidden;
`;

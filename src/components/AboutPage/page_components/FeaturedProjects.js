import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function FeaturedProjects() {
  return (
    <StyledSection>
      {/* <h2>Featured Projects</h2> */}
      <Tile>
        <h3>Project Title Example</h3>
        <p>Lorem ipsum dolor sit amet consectetur. Animi, similique nisi soluta quo.</p>
        <img src="./project-images/project-1.png" alt="" />
        <Link to="/blog">View Project Details</Link>
        <Link to="/blog">Open PDF</Link>
      </Tile>
      <Tile>
        <h3>Tile Title Example</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur, Lorem ipsum dolor sit amet. adipisicing elit.
          Animi, similique nisi soluta.
        </p>
        <img src="./project-images/project-2.png" alt="" />
        <Link to="/blog">View Project Details</Link>
        <Link to="/blog">Open PDF</Link>
      </Tile>
    </StyledSection>
  );
}
export default FeaturedProjects;

const StyledSection = styled.section`
  margin: 3rem auto;
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  h2 {
    font-weight: 500;
  }
`;

const Tile = styled.div`
  width: 50%;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  h3 {
    font-weight: 400;
    font-size: 1.2rem;
  }
  p {
    padding: 0.25rem 0;
    font-weight: 200;
    line-height: 1.75rem;
  }

  a {
    width: fit-content;
  }
  @media (max-width: 1000px) {
  }
`;

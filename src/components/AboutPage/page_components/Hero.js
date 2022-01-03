import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
// Icons
import Gitgub from "../../../img/GitHub";


function Hero() {
  return (
    <StyledSection>
      <Image src={"./profile-img.jpeg"} alt="Profile image of George Anagnostou" />

      <Description>
        <h2>Welcome to my webpage</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, similique nisi soluta
          quo, exercitationem. Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
          <Link to="/blog">Porro</Link> dolore fugiat voluptate odit quibusdam molestiae error,
          similique repudiandae doloribus porro.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, similique nisi soluta.
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque eaque amet neque autem ex
          iusto ut facilis temporibus aliquid impedit.
        </p>
      </Description>

      <QuickLinks>
        <h4>Quick Links</h4>

        <ul>
          <li>
            <Link to={"/blog"}>Newest Blog</Link>
          </li>
          <li>
            <Link to={"/library"}>Library</Link> &gt; <Link to={"/library/movies"}>Movies</Link>
          </li>
          <li>
            <Link to={"/rssfeed"}>RSS Feed</Link>
          </li>
          <li>
            <Link to={"/projects"}>Current Project</Link>
          </li>
        </ul>

        <h4>Externals</h4>

        <div className="social-links">
          <a href="https://github.com/George-Anagnostou" target="_blank" rel="noreferrer">
            <Gitgub />
          </a>
          <a href="https://github.com/George-Anagnostou" target="_blank" rel="noreferrer">
            <Gitgub />
          </a>
          <a href="https://github.com/George-Anagnostou" target="_blank" rel="noreferrer">
            <Gitgub />
          </a>
        </div>
      </QuickLinks>
    </StyledSection>
  );
}
export default Hero;

const StyledSection = styled.section`
  padding: 3rem 0;
  display: flex;
  align-items: stretch;
`;

const Image = styled.img`
  display: block;
  width: 250px;
  border-radius: 5px;
  filter: brightness(1.1);
`;

const Description = styled.div`
  margin: 0 1rem;

  h2 {
    font-weight: 400;
  }

  p {
    padding: 0.5rem 0;
    font-weight: 200;
    font-size: 1.2rem;
    line-height: 1.75rem;
  }

  @media (max-width: 1000px) {
  }
`;

const QuickLinks = styled.div`
  min-width: 250px;
  min-height: 100%;
  border: 1px solid #888;
  border-radius: 5px;

  h4 {
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0.5rem;
  }

  ul {
    li {
      margin: 0.5rem 1.5rem 2rem;
      a {
        cursor: pointer;
      }
    }
  }

  .social-links {
    display: flex;
    justify-content: space-evenly;
  }
`;

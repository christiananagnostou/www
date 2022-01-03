import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Nav() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updatehidden = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setHidden(scrollY > lastScrollY ? true : false);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatehidden);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  return (
    <StyledNav style={hidden ? { top: "-8vh" } : { top: 0 }}>
      <div className="max-width">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/library">Library</Link>
          </li>
        </ul>
        <h1>
          <Link id="logo" to="/">
            George Anagnostou
          </Link>
        </h1>
        <ul>
          <li>
            <Link to="/work">Work</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </StyledNav>
  );
}
export default Nav;

const StyledNav = styled.nav`
  height: 8vh;
  padding: 1rem 0;
  background: #fff;
  box-shadow: 0 2px 4px #e3e3e3;
  position: sticky;
  z-index: 999;
  transition: all 0.5s ease;

  .max-width {
    height: 100%;
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;
  }

  a {
    color: #1b1b1b;
    text-decoration: none;
  }
  ul {
    display: flex;
    list-style: none;
    justify-content: center;
  }
  li {
    padding: 0 2rem;
    position: relative;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  #logo {
    font-size: 1.75rem;
    font-weight: 400;
    * {
      word-break: none;
      min-width: max-content;
    }
    &:hover {
      text-decoration: none;
    }
  }
  @media (max-width: 1300px) {
    li {
      padding: 0 0.75rem;
    }
  }
  @media (max-width: 500px) {
  }
`;

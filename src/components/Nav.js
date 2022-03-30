import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

function Nav() {
  const { pathname } = useLocation();

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
    <StyledNav style={hidden ? { top: "-10vh" } : { top: 0 }}>
      <h1>
        <Link id="logo" to="/">
          CA
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="/">About Me</Link>
          <Line
            transition={{ duration: 0.3 }}
            initial={{ width: "0%" }}
            animate={{ width: pathname === "/" ? "63%" : "0%" }}
          />
        </li>
        <li>
          <Link to="/contact">Contact Me</Link>
          <Line
            transition={{ duration: 0.3 }}
            initial={{ width: "0%" }}
            animate={{ width: pathname === "/contact" ? "60%" : "0%" }}
          />
        </li>
      </ul>
    </StyledNav>
  );
}
export default Nav;

const StyledNav = styled.nav`
  height: 10vh;
  display: flex;
  margin: auto;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 8rem;
  background: rgba(20, 20, 20, 0.9);
  position: sticky;
  z-index: 999;
  transition: all 0.5s ease;
  a {
    color: white;
    text-decoration: none;
  }
  ul {
    display: flex;
    list-style: none;
    justify-content: flex-end;
  }
  li {
    padding-left: 8rem;
    position: relative;
    font-size: 1.2rem;
  }
  #logo {
    font-size: 3rem;
    font-family: "Lobster", cursive;
    font-weight: lighter;
  }
  @media (max-width: 1300px) {
    #logo {
      text-align: center;
      display: inline-block;
      margin-top: 0.5rem;
      font-size: 3rem;
    }
    ul {
      width: 100%;
    }
    li {
      padding: 0 0.5rem;
    }
  }
  @media (max-width: 500px) {
    padding: 1rem 4rem;
  }
`;

const Line = styled(motion.div)`
  height: 0.2rem;
  background: #4769ff;
  width: 0%;
  position: absolute;
  bottom: -50%;
  left: 50%;
  border-radius: 2px;
  @media (max-width: 1300px) {
    left: 20%;
  }
`;

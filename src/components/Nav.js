import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

function Nav() {
  const { pathname } = useLocation();
  return (
    <StyledNav>
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
          <Link to="/work">My Work</Link>
          <Line
            transition={{ duration: 0.3 }}
            initial={{ width: "0%" }}
            animate={{ width: pathname.includes("/work") ? "65%" : "0%" }}
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

const StyledNav = styled.nav`
  min-height: 10vh;
  display: flex;
  margin: auto;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 10rem;
  background: #282828;
  position: sticky;
  top: 0;
  z-index: 999;
  a {
    color: white;
    text-decoration: none;
  }
  ul {
    display: flex;
    list-style: none;
  }
  li {
    padding-left: 8rem;
    position: relative;
  }
  #logo {
    font-size: 2rem;
    font-family: "Lobster", cursive;
    font-weight: lighter;
  }
  @media (max-width: 1300px) {
    flex-direction: column;
    padding: 2rem 1rem;
    #logo {
      text-align: center;
      display: inline-block;
      margin-top: 0.5rem;
      font-size: 3rem;
    }
    ul {
      padding: 2rem 1rem 1rem;
      justify-content: space-around;
      width: 100%;
    }
    li {
      padding: 0 0.5rem;
      transform: scale(1.25);
    }
  }
`;

const Line = styled(motion.div)`
  height: 0.3rem;
  background: #fe5a1d;
  width: 0%;
  position: absolute;
  bottom: -50%;
  left: 50%;
  border-radius: 2px;
  @media (max-width: 1300px) {
    left: 20%;
  }
`;

export default Nav;

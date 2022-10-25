import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Links = [
  { href: "/", title: "About" },
  { href: "/projects", title: "Projects" },
  { href: "/contact", title: "Contact" },
];

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
      <div className="max-w-screen">
        <Link id="logo" to="/">
          <Image>
            <img src={"/A.webp"} alt="home profile" />
          </Image>
        </Link>
        <ul>
          {Links.map(({ href, title }) => (
            <li key={title}>
              <Link to={href}>{title}</Link>
              <Line
                transition={{ duration: 0.3 }}
                initial={{ width: "0%" }}
                animate={{ width: pathname === href ? "100%" : "0%" }}
              />
            </li>
          ))}
        </ul>
      </div>
    </StyledNav>
  );
}
export default Nav;

const StyledNav = styled.nav`
  height: 50px;
  padding: 0.2rem 1rem;
  background: rgba(20, 20, 20, 0.6);
  display: flex;
  align-items: center;
  position: sticky;
  z-index: 999;
  transition: all 0.5s ease;

  .max-w-screen {
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;
  }

  a {
    color: var(--heading);
    text-decoration: none !important;
    transition: color 0.3s ease;

    &:hover {
      color: white;
    }
  }

  ul {
    display: flex;
    list-style: none;
    justify-content: flex-end;
  }
  li {
    margin-left: 1rem;
    padding: 0.25rem 0.5rem;
    position: relative;
    font-size: 1rem;
  }
`;

const Image = styled.div`
  img {
    aspect-ratio: 1;
    margin: auto;
    border-radius: 50%;
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    height: 30px;
    width: 30px;
  }
`;

const Line = styled(motion.div)`
  height: 1px;
  background: var(--accent);
  width: 0%;
  position: absolute;
  bottom: -20%;
  left: 2px;
`;

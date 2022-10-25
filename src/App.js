import React from "react";
// Style
import GlobalStyle from "./components/GlobalStyle";
// Components
import Nav from "./components/Nav";
// Pages
import AboutMe from "./components/HomePage/AboutPage";
import ProjectList from "./components/HomePage/page_components/ProjectList";
import ProjectDetails from "./components/ProjectPage/ProjectDetails";
import ContactUs from "./components/ContactPage/ContactUs";
// Router
import { Routes, Route, useLocation } from "react-router-dom";
// Animation
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <GlobalStyle />
      <Nav />
      <div className="blur" aria-hidden="true" />

      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AboutMe />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/work/:id" element={<ProjectDetails />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

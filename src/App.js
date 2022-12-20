import React from "react";
// Style
import GlobalStyle from "./components/GlobalStyle";
// Components
import Nav from "./components/Nav";
// Pages
import Homepage from "./components/HomePage";
import ProjectList from "./components/WorksListPage/ProjectList";
import ProjectDetails from "./components/SingleWorkPage";
import ArtPage from "./components/ArtPage";
import ContactUs from "./components/ContactPage";
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

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Homepage />} />
          <Route path="/works" element={<ProjectList />} />
          <Route path="/work/:id" element={<ProjectDetails />} />
          <Route path="/art" element={<ArtPage />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

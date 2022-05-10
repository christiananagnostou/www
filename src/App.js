import React from "react";
// Style
import GlobalStyle from "./components/GlobalStyle";
// Components
import Nav from "./components/Nav";
// Pages
import AboutMe from "./components/HomePage/AboutPage";
import ContactUs from "./components/ContactPage/ContactUs";
import ProjectDetails from "./components/ProjectPage/ProjectDetails";
// Router
import { Switch, Route, useLocation } from "react-router-dom";
// Animation
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <GlobalStyle />

      <Nav />

      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route path="/" exact>
            <AboutMe />
          </Route>

          <Route path="/work/:id">
            <ProjectDetails />
          </Route>

          <Route path="/contact">
            <ContactUs />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;

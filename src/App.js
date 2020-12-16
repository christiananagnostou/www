import React from "react";
// Style
import GlobalStyle from "./components/GlobalStyle";
// Components
import Nav from "./components/Nav";
// Pages
import AboutMe from "./components/AboutPage/AboutMe";
import ContactUs from "./components/ContactPage/ContactUs";
import MyWork from "./components/MyWorkPage/MyWork";
import MovieDetails from "./components/MyWorkPage/MovieDetails";
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
          <Route path="/work" exact>
            <MyWork />
          </Route>
          <Route path="/work/:id">
            <MovieDetails />
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

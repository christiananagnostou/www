import React from "react";
import { Link } from "react-router-dom";
import profileImg from "../../../img/profile-img.jpg";
import { About, Description, Image, Hide } from "../../styles";
// Framer Motion
import { motion } from "framer-motion";
import { titleAnim, fade, photoAnim } from "../../../animation";
import Wave from "./Wave";

function AboutSection() {
  return (
    <About>
      <Description>
        <motion.div className="title">
          <Hide>
            <motion.h2 variants={titleAnim}>Allow me to</motion.h2>
          </Hide>
          <Hide>
            <motion.h2 variants={titleAnim}>introduce myself.</motion.h2>
          </Hide>
          <Hide>
            <motion.h2 variants={titleAnim}>
              My name is <span>Christian</span>
            </motion.h2>
          </Hide>
        </motion.div>
        <motion.p variants={fade}>
          I'm a <span>web developer</span> living in the SF Bay Area
          <br />
          Welcome to my little corner of the web and GO GIANTS!
        </motion.p>
        <Link to="/work">
          <motion.button variants={fade}>My latest work</motion.button>
        </Link>
      </Description>
      <Wave />
      <Image>
        <motion.img variants={photoAnim} src={profileImg} alt="home profile image" />
      </Image>
    </About>
  );
}

export default AboutSection;

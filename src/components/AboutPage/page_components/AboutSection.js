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
          I am a creative <span>web developer</span> living in the SF Bay Area.
          <br />
          Self-taught with a passion for learning whatever gets thrown my way.
        </motion.p>
        <Link to="/contact">
          <motion.button variants={fade}>drop me a line</motion.button>
        </Link>
      </Description>
      <Wave />
      <Image>
        <motion.img variants={photoAnim} src={profileImg} alt="guy with camera" />
      </Image>
    </About>
  );
}

export default AboutSection;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ProjectState } from "../../projectState";
// Animations
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";

function ProjectDetails() {
  const history = useHistory();
  const url = history.location.pathname;
  // eslint-disable-next-line
  const [projects, setProjects] = useState(ProjectState);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const currentProject = projects.filter((stateProject) => stateProject.url === url);
    setProject(currentProject[0]);
  }, [url, projects]);

  return (
    <>
      {project && (
        <Details variants={pageAnimation} initial="hidden" animate="show" exit="exit">
          <h2>{project.title}</h2>{" "}
          <motion.a
            className="live-link"
            href={project.projectLink}
            target="_blank"
            rel="noreferrer"
          >
            Live view
          </motion.a>
          <Headline>
            <img src={project.mobileImg} alt="" />
            <Awards>
              {project.details.map((award) => (
                <Award key={award.title} title={award.title} description={award.description} />
              ))}
            </Awards>
          </Headline>
          <ImageDisplay>
            <img src={project.desktopImg} alt="" />
          </ImageDisplay>
        </Details>
      )}
    </>
  );
}

// Award Component
const Award = ({ title, description }) => {
  return (
    <AwardStyle>
      <h3>{title}</h3>
      <div className="line"></div>
      <p>{description}</p>
    </AwardStyle>
  );
};

// styled components
const Details = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    color: #cfcfcf;
    padding-top: 5vh;
    margin: auto;
  }
  .live-link {
    display: block;
    width: fit-content;
    color: #cfcfcf;
    text-decoration: none;
    font-size: 1.5rem;
    border: 1px solid #cfcfcf;
    padding: 0.75rem;
    margin-top: 1rem;
    cursor: alias;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: black;
    }
  }
  @media (max-width: 1100px) {
    h2 {
      font-size: 2.5em;
    }
  }
`;

const Headline = styled.div`
  height: 80vh;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5rem 0;
  img {
    transform: scale(0.6);
  }
  @media (max-width: 1100px) {
    height: fit-content;
    margin: 1rem 0;
    flex-direction: column;
    img {
      transform: scale(0.8);
      display: block;
    }
  }
  @media (max-width: 400px) {
    img {
      transform: scale(0.6);
    }
  }
`;

const Awards = styled.div`
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;
  @media (max-width: 1100px) {
    margin: 0;
  }
`;

const AwardStyle = styled.div`
  width: 80%;
  h3 {
    font-size: 2rem;
  }
  .line {
    width: 50%;
    background: #fe5a1d;
    height: 0.5rem;
    margin: 1rem 0;
  }
  p {
    padding: 2rem 0;
  }
  @media (max-width: 1100px) {
    width: 100%;
    text-align: center;
    .line {
      margin: 0.5rem auto;
    }
  }
`;

const ImageDisplay = styled.div`
  width: 100vw;
  img {
    margin: auto;
    margin-bottom: 2rem;
    display: block;
    width: 80%;
    height: auto;
  }
  @media (max-width: 1100px) {
    img {
      width: 95%;
    }
  }
`;

export default ProjectDetails;

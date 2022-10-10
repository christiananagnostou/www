import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { projectState } from "../../projectState";
// Animations
import { motion } from "framer-motion";
import { pageAnimation } from "../../animation";
import ScrollTop from "../ScrollTop";

function ProjectDetails() {
  const history = useHistory();
  const url = history.location.pathname;

  const [project, setProject] = useState(null);

  useEffect(() => {
    const currentProject = projectState.filter((stateProject) => stateProject.url === url);
    setProject(currentProject[0]);
  }, [url]);

  return (
    <>
      <ScrollTop />

      {project && (
        <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
          <h2>{project.title}</h2>

          <div className="link-container">
            <motion.a
              className="live-link"
              href={project.externalLink}
              target="_blank"
              rel="noreferrer"
            >
              Live view
            </motion.a>
            <motion.a className="live-link" href={project.github} target="_blank" rel="noreferrer">
              Github Repo
            </motion.a>
          </div>

          <MobileAndText>
            <div className="mobile-imgs">
              {project.mobileImgs.map((image, i) => (
                <MobileImage key={i}>
                  <img src={image} alt="mobile" />
                </MobileImage>
              ))}
            </div>

            <Details>
              {project.details.map(({ title, description }, i) => (
                <Detail key={i} title={title} description={description} index={i} />
              ))}
            </Details>
          </MobileAndText>

          {project.desktopImgs.map((image, i) => (
            <DesktopImage key={i}>
              <img src={image} alt={`desktop ${i}`} />
            </DesktopImage>
          ))}
        </Container>
      )}
    </>
  );
}

// Detail Component
const Detail = ({ title, description, index }) => {
  return (
    <DetailStyle>
      <h3>{title}</h3>
      <div className="line" style={{ width: 15 * (index + 1) + "%" }}></div>
      <p>{description}</p>
    </DetailStyle>
  );
};

// styled components
const Container = styled(motion.div)`
  max-width: var(--max-w-screen);
  padding: 1rem;
  margin: auto;

  h2 {
    color: #cfcfcf;
    padding-top: 5vh;
    font-size: 1.8rem;
    font-weight: 300;
  }
  .link-container {
    display: flex;
    margin: 1rem 0;

    .live-link {
      text-decoration: none;
      font-size: 1rem;
      color: #ccc;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      margin-right: 30px;
      border-bottom: 1px solid var(--accent);

      &:hover {
        color: var(--accent);
        border-bottom: 1px solid var(--accent);
      }
    }
  }
`;

const MobileAndText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0 0;
  overflow: hidden;

  .mobile-imgs {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    img {
      max-height: 500px;
      max-width: 100%;
    }
  }
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DetailStyle = styled.div`
  padding: 2rem 1rem;
  border-radius: 5px;
  background: rgba(20, 20, 20, 0.5);
  margin-bottom: 2.5rem;
  h3 {
    font-size: 1.5rem;
    font-weight: 300;
  }
  .line {
    background: var(--accent);
    height: 1px;
    margin: 0.5rem 0;
  }
  p {
    padding: 1rem 0 0;
    font-weight: 200;
    letter-spacing: 1px;
    font-size: 1rem;
  }
`;

const DesktopImage = styled.div`
  img {
    max-width: 100%;
    margin-bottom: 5rem;
    display: block;
    height: auto;
    border-radius: 5px;
  }
`;

const MobileImage = styled.div`
  margin: 0 1rem;
  flex: 1;
  img {
    margin: auto;
    margin-bottom: 2rem;
    display: block;
    height: 85vh;
    width: auto;
    border-radius: 5px;
  }
`;

export default ProjectDetails;

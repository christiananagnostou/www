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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    width: 80%;
    color: #cfcfcf;
    padding-top: 5vh;
    margin: auto;
    font-size: 5rem;
    font-weight: 300;
  }
  .link-container {
    width: 80%;
    display: flex;
    margin: 1rem 0;

    .live-link {
      text-decoration: none;
      font-size: 1.1rem;
      color: #ccc;
      padding: 0 0.4rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      margin-left: 10px;
      border-bottom: 1px solid #6da5ea;

      &:hover {
        color: #6da5ea;
        border-bottom: 1px solid #6da5ea;
      }
    }
  }
`;

const MobileAndText = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5rem 0;
  overflow: hidden;

  .mobile-imgs {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-width: 40%;
  }

  @media (max-width: 1200px) {
    width: 100%;
    height: fit-content;
    margin: 1rem 0;
    flex-direction: column-reverse;

    .mobile-imgs {
      width: 100%;
    }
  }
`;

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;
  @media (max-width: 1200px) {
    margin: 0 1rem;
    flex: 1;
    flex-direction: row;
    align-items: stretch;
    margin-bottom: 3rem;
  }
  @media (max-width: 700px) {
    margin: 0;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }
`;

const DetailStyle = styled.div`
  width: 90%;
  border-radius: 10px;
  padding: 1rem 2rem;
  background: rgba(20, 20, 20, 0.5);
  box-shadow: 15px 15px 0 rgba(20, 20, 20, 0.9);
  border: 1px solid #6da5ea;
  margin-bottom: 2.5rem;
  h3 {
    font-size: 1.5rem;
    font-weight: 300;
  }
  .line {
    background: #6da5ea;
    height: 1px;
    margin: 0.5rem;
  }
  p {
    padding: 1rem 0 0;
    font-weight: 200;
    letter-spacing: 1px;
    font-size: 1rem;
    margin: 0 2rem;
  }
  @media (max-width: 1200px) {
    flex: 1;
    margin: 0 1rem;
    text-align: center;
    .line {
      margin: 0.5rem auto;
    }
  }
  @media (max-width: 700px) {
    width: 95%;
    margin: 1rem 0;
  }
`;

const DesktopImage = styled.div`
  width: 100vw;
  img {
    margin: auto;
    margin-bottom: 2rem;
    display: block;
    width: 80%;
    height: auto;
    border-radius: 10px;
  }
  @media (max-width: 1200px) {
    img {
      width: 95%;
    }
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
    border-radius: 10px;
  }
  @media (max-width: 1200px) {
    width: 45%;
  }
  @media (max-width: 700px) {
    img {
      height: 60vh;
      width: auto;
    }
  }
`;

export default ProjectDetails;

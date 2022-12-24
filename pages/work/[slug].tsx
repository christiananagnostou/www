import { motion } from "framer-motion";
import Image from "next/image";
import styled from "styled-components";
import { pageAnimation } from "../../components/animation";
import { ProjectState } from "../../data/ProjectState";
import { Project } from "../../types";

import { GetStaticPaths, GetStaticProps } from "next";

type Props = {
  project: Project;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ProjectState.map((project) => ({ params: { slug: project.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const project = ProjectState.find((proj) => proj.slug === context.params?.slug);
  return { props: { project } };
};

const SingleProject = ({ project }: Props) => {
  return (
    <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <h2>{project.title}</h2>

      <div className="link-container">
        {project.externalLink && (
          <motion.a
            className="live-link"
            href={project.externalLink}
            target="_blank"
            rel="noreferrer"
          >
            Live Site
          </motion.a>
        )}

        {project.github && (
          <motion.a className="live-link" href={project.github} target="_blank" rel="noreferrer">
            Github
          </motion.a>
        )}
      </div>

      <DesktopImage>
        <Image
          src={project.desktopImgs[0]}
          alt="desktop hero"
          width={1000}
          height={666}
          loading="eager"
        />
      </DesktopImage>

      <MobileAndText>
        <Details>
          {project.details.map(({ title, description }, i) => (
            <Detail key={i} title={title} description={description} index={i} />
          ))}
        </Details>

        <div className="mobile-imgs">
          {project.mobileImgs.map((image, i) => (
            <MobileImage key={i}>
              <Image src={image} alt="mobile" height={600} width={300} />
            </MobileImage>
          ))}
        </div>
      </MobileAndText>

      {project.desktopImgs.slice(1).map((image, i) => (
        <DesktopImage key={i}>
          <Image src={image} alt={`desktop ${i}`} width={1000} height={666} />
        </DesktopImage>
      ))}
    </Container>
  );
};

export default SingleProject;

const Detail = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <DetailStyle>
      <h3>{title}</h3>
      <div className="line" style={{ width: 15 * (index + 1) + "%" }}></div>
      <p>{description}</p>
    </DetailStyle>
  );
};

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
      font-size: 1rem;
      color: #ccc;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      margin-right: 30px;

      &:hover {
        color: white;
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
    line-height: 1.5rem;
  }
`;

const DesktopImage = styled.div`
  img {
    max-width: 100%;
    margin-bottom: 2rem;
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
    width: auto;
    max-height: 500px;
    max-width: 100%;
    border-radius: 5px;
  }
`;

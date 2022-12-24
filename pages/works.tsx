import { motion } from "framer-motion";
import styled from "styled-components";
import { pageAnimation } from "../components/animation";
import PageTitle from "../components/Styles/PageTitle";
import ProjectTile from "../components/Work/ProjectTile";
import { ProjectState } from "../data/ProjectState";

type Props = {};

function works({}: Props) {
  return (
    <Work id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <PageTitle titleLeft="my curated" titleRight="web creations" />

      <ProjectListStyle>
        {ProjectState.map((project) => (
          <ProjectTile project={project} key={project.title} />
        ))}
      </ProjectListStyle>
    </Work>
  );
}

const Work = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`;

const ProjectListStyle = styled.section``;

export default works;

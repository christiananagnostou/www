import { motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { fade, pageAnimation } from "../../animation";
import ScrollTop from "../ScrollTop";
import Range from "../shared/Range";
import Image from "./Image";

const ArtPage = () => {
  const [numColumns, setNumColumns] = useState(3);

  const columns = [...new Array(numColumns).fill(0).map((_) => [])];
  // @ts-ignore
  Images.map((img, i) => columns[i % numColumns].push(img));

  return (
    <Container id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
      <motion.h2 variants={fade} className="title">
        <span>my adventures</span>
        <span className="bar"></span>
        <span>captured forever</span>
      </motion.h2>

      <div className="control-bar">
        <Range
          type="range"
          min={1}
          max={8}
          value={numColumns}
          onChange={(e) => setNumColumns(parseInt(e.target.value))}
        />

        <span className="col-num">{numColumns}</span>
      </div>

      <Columns numColumns={numColumns}>
        {columns.map((col, i) => (
          <Column key={"column_" + i} numColumns={numColumns}>
            {col.map((img) => (
              <Image src={`/art/photography/${img}`} key={img} />
            ))}
          </Column>
        ))}
      </Columns>

      <ScrollTop />
    </Container>
  );
};

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);

  padding: 0 1rem;
  margin: 1.5rem auto;

  @media screen and (min-width: 768px) {
    margin: 5rem auto;
  }

  .title {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (min-width: 768px) {
      margin-bottom: 2rem;
    }

    span {
      font-weight: 200;
      font-size: 0.9rem;
      color: var(--text);
    }

    .bar {
      height: 0;
      flex: 1;
      margin: 0 1rem;
      border-bottom: 1px solid var(--accent);
    }
  }

  .control-bar {
    display: flex;
    align-items: center;
    max-width: 25%;
    margin-bottom: 1rem;

    .col-num {
      display: block;
      margin-left: 1rem;
    }
  }
`;

const Columns = styled.section`
  display: flex;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
`;

const Column = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
  flex: 1;
`;

export default ArtPage;

const Images = [
  // Snow
  "ski_lift.jpg",
  "george_snow.jpg",
  "blizzard.jpg",
  "angel.jpg",
  "snow_watch.jpg",
  "snow_bridge.jpg",
  "meadow.jpg",

  // Shadow
  "alan.jpg",
  "building_shadows.jpg",
  "chair.jpg",
  "stair_shadow.jpg",
  "jessie_succ.jpg",
  "chinese_balloon.jpg",
  "crow.jpg",
  "orange_wall.jpg",
  "esclalator.jpg",

  // Isolation
  "umbrella.jpg",
  "brick_wall.jpg",
  "fancy_bag.jpg",
  "basketball.jpg",

  // People
  "stipple.jpg",
  "asian_flute.jpg",
  "denim.jpg",
  "window_watcher.jpg",
  "dressy_man.jpg",
  "reading_man.jpg",
  "painter.jpg",
  "painter2.jpg",
  "jesus.jpg",

  // Cars
  "symbolism.jpg",
  "beach_cadillac.jpg",
  "burnt_car2.jpg",
  "white_bus.jpg",
  "burnt_car.jpg",

  // City
  "trolly.jpg",
  "salesforce.jpg",
  "reflection.jpg",
  "capitol.jpg",
  "church.jpg",

  // Earth
  "monument_valley.jpg",
  "horseshoe.jpg",
  "rock_wave.jpg",
  "zion2.jpg",
  "zion1.jpg",

  // B&W
  "coit.jpg",
  "arrow_up.jpg",
  "satalite.jpg",
  "adobe_bnw.jpg",
  "bird_shit.jpg",
  "levels.jpg",
  "golden_gate.jpg",
  "skateboard.jpg",
  "dad_soccer.jpg",
];

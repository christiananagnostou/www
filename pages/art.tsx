import { AnimationControls, motion, Variants } from "framer-motion";
import Head from "next/head";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import { fade, pageAnimation } from "../components/animation";
import { useScroll } from "../components/Hooks/useScroll";
import Range from "../components/Shared/Range";
import PageTitle from "../components/Styles/PageTitle";
import { ArtState } from "../data/ArtState";

type Props = {};

const categories = Object.keys(ArtState);

const Art = (props: Props) => {
  const [numColumns, setNumColumns] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const columns = [...new Array(numColumns).fill(0).map((_) => [] as StaticImageData[])];
  ArtState[selectedCategory]?.map((img, i) => columns[i % numColumns].push(img));

  return (
    <>
      <Head>
        <title>Art - Christian Anagnostou</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <PageTitle titleLeft="my adventures" titleRight="captured forever" />

        <div className="control-bar">
          <div className="range-wrap">
            <Range
              type="range"
              min={1}
              max={8}
              value={numColumns}
              onChange={(e) => setNumColumns(parseInt(e.target.value))}
            />

            <span className="col-num">{numColumns}</span>
          </div>

          <div className="categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "highlight" : ""}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Columns numColumns={numColumns}>
          {columns.map((col, i) => (
            <Column
              key={"column_" + i}
              numColumns={numColumns}
              variants={{ show: { transition: { staggerChildren: 0.5 } } }}
            >
              {col.map((ImageData) => (
                <Img imageData={ImageData} key={ImageData.src} />
              ))}
            </Column>
          ))}
        </Columns>
      </Container>
    </>
  );
};

export default Art;

const Img = ({ imageData }: { imageData: StaticImageData }) => {
  const [ref, controls] = useScroll();

  return (
    <ImageContainer
      ref={ref as React.Ref<HTMLDivElement>}
      variants={fade as Variants}
      animate={controls as AnimationControls}
      initial="hidden"
    >
      <Image src={imageData} alt="By Christian Anagnostou" blurDataURL={imageData.blurDataURL} />
    </ImageContainer>
  );
};

const ImageContainer = styled(motion.div)`
  position: relative;

  img {
    display: block;
    max-width: 100%;
    height: auto;
    width: 100%;
    border-radius: 5px;
  }
`;

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;

  .control-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    .range-wrap {
      max-width: 25%;
      display: flex;
      align-items: center;

      .col-num {
        display: block;
        margin-left: 1rem;
      }
    }

    .categories {
      display: flex;

      button {
        background: transparent;
        border: none;
        font-size: 1rem;
        margin-left: 20px;

        color: var(--text);
        border-radius: 1px;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: white;
        }
        &.highlight {
          color: white;
        }
      }
    }
  }
`;

const Columns = styled.section<{ numColumns: number }>`
  display: flex;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
`;

const Column = styled(motion.div)<{ numColumns: number }>`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
  flex: 1;
`;

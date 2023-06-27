import { motion } from 'framer-motion'
import Head from 'next/head'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'
import { pageAnimation, photoAnim } from '../components/animation'
import { useScroll } from '../components/Hooks'
import Range from '../components/Shared/Range'
import { ArtState } from '../lib/art'

type Props = {}

const categories = Object.keys(ArtState)

const Art = (props: Props) => {
  const [numColumns, setNumColumns] = useState(4)
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  const columns = [...new Array(numColumns).fill(0).map((_) => [] as StaticImageData[])]
  ArtState[selectedCategory]?.map((img, i) => columns[i % numColumns].push(img))

  return (
    <>
      <Head>
        <title>Art</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        {/* <PageTitle titleLeft="my adventures" titleRight="captured forever" /> */}

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
                className={selectedCategory === category ? 'highlight' : ''}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Columns numColumns={numColumns}>
          {columns.map((images, col) => (
            <Column
              key={'column_' + col}
              numColumns={numColumns}
              variants={{ show: { transition: { staggerChildren: 0.5 } } }}
            >
              {images.map((ImageData, row) => (
                <Img imageData={ImageData} priority={row < 4} key={ImageData.src} />
              ))}
            </Column>
          ))}
        </Columns>
      </Container>
    </>
  )
}

export default Art

const Img = ({ imageData, priority }: { imageData: StaticImageData; priority: boolean }) => {
  const [ref, controls] = useScroll()

  return (
    <Hide>
      <ImageContainer ref={ref as React.Ref<HTMLDivElement>} variants={photoAnim} animate={controls} initial="hidden">
        <Image
          src={imageData}
          alt="By Christian Anagnostou"
          blurDataURL={imageData.blurDataURL}
          placeholder="blur"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      </ImageContainer>
    </Hide>
  )
}

const Hide = styled.div`
  overflow: hidden;
  border-radius: 5px;
  transition: all 0.5s ease;
  width: 100%;
  position: relative;

  &:hover {
    box-shadow: 0 5px 20px 10px rgba(20, 20, 20, 0.9);
  }
`

const ImageContainer = styled(motion.div)`
  position: relative;

  img {
    display: block;
    height: auto;
    width: 100%;
    max-width: 100%;
    border-radius: 5px;
  }
`

const Container = styled(motion.div)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
  position: relative;

  .control-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    .range-wrap {
      max-width: 15%;
      display: flex;
      align-items: center;

      .col-num {
        display: block;
        font-weight: 400;
        margin-left: 1rem;
        font-size: 1.1rem;
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
`

const Columns = styled.section<{ numColumns: number }>`
  display: flex;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
`

const Column = styled(motion.div)<{ numColumns: number }>`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ numColumns }) => 20 - numColumns * 1.5}px;
  flex: 1;
`

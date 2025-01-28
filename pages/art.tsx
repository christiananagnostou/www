import { motion } from 'framer-motion'
import Head from 'next/head'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation, photoAnim } from '../components/animation'
import { useScroll } from '../components/Hooks'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { ArtState } from '../lib/art'

type Props = {}

const ART_CATEGORIES = Object.keys(ArtState)
const NUM_COLUMNS = 2

const Art = (props: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(ART_CATEGORIES[0])

  const columns = [...new Array(NUM_COLUMNS).fill(0).map((_) => [] as StaticImageData[])]
  ArtState[selectedCategory]?.map((img, i) => columns[i % NUM_COLUMNS].push(img))

  return (
    <>
      <Head>
        <title>Art</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container id="work" variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Heading variants={fade}>
          <h1>Photography</h1>
          <p>
            There&apos;s something profound about capturing the world around us. Not necessarily to share it with
            others, but to remember it. To remember the way the light hit the trees, or the way the flakes of snow fell
            from the sky. It creates a moment that you can return to, even if just in your mind.
          </p>
        </Heading>

        {ART_CATEGORIES.length > 1 && (
          <ButtonRow>
            {ART_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'highlight' : ''}
              >
                {category}
              </button>
            ))}
          </ButtonRow>
        )}

        <Columns $numColumns={NUM_COLUMNS}>
          {columns.map((images, col) => (
            <Column
              key={'column_' + col}
              $numColumns={NUM_COLUMNS}
              variants={{ show: { transition: { staggerChildren: 0.5 } } }}
            >
              {images.map((ImageData, row) => (
                <Img key={ImageData.src} imageData={ImageData} priority={row < 4} />
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

const Container = styled(motion.section)`
  overflow: hidden;
  color: var(--text);
  max-width: var(--max-w-screen);
  padding: 0 1rem;
  margin: 2rem auto;
`

const Columns = styled.section<{ $numColumns: number }>`
  display: flex;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
`

const Column = styled(motion.div)<{ $numColumns: number }>`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
  flex: 1;
`

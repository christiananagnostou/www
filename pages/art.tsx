import { AnimatePresence, motion } from 'framer-motion'
import Head from 'next/head'
import Image, { StaticImageData } from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { fade, pageAnimation } from '../components/animation'
import { ButtonRow } from '../components/Shared/ButtonRow'
import { Heading } from '../components/Shared/Heading'
import { ArtState } from '../lib/art'

type Props = {}

const ART_CATEGORIES = Object.keys(ArtState)
const NUM_COLUMNS = 2

const Art = (props: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(ART_CATEGORIES[0])
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const flatImages: StaticImageData[] = ArtState[selectedCategory] || []

  // Distribute images into columns for the grid.
  const columns = Array.from({ length: NUM_COLUMNS }, () => [] as { image: StaticImageData; index: number }[])
  flatImages.forEach((img, i) => {
    columns[i % NUM_COLUMNS].push({ image: img, index: i })
  })

  return (
    <>
      <Head>
        <title>Art</title>
        <meta name="description" content="Christian Anagnostou's Web Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container variants={pageAnimation} initial="hidden" animate="show" exit="exit">
        <Heading variants={fade}>
          <h1>Photography</h1>
          <p>There&apos;s something profound about capturing the world around us – to remember a moment perfectly.</p>
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
          {columns.map((colImages, col) => (
            <Column
              key={`column_${col}`}
              $numColumns={NUM_COLUMNS}
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              {colImages.map(({ image, index }, row) => (
                <Img key={image.src} imageData={image} priority={row < 4} onClick={() => setModalIndex(index)} />
              ))}
            </Column>
          ))}
        </Columns>
      </Container>

      <AnimatePresence>
        {modalIndex !== null && (
          <FullscreenModal
            images={flatImages}
            currentIndex={modalIndex}
            onClose={() => setModalIndex(null)}
            onNavigate={(newIndex) => setModalIndex(newIndex)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Art

// Grid image component using a shared layoutId.
const Img = React.memo(
  ({ imageData, priority, onClick }: { imageData: StaticImageData; priority: boolean; onClick: () => void }) => {
    return (
      <ImageContainer
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        role="button"
        tabIndex={0}
        aria-label="Open full screen image"
        layoutId={`image-${imageData.src}`}
        variants={fade}
        initial="hidden"
        animate="show"
      >
        <Image
          src={imageData}
          alt=""
          blurDataURL={imageData.blurDataURL}
          placeholder="blur"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          layout="responsive"
        />
      </ImageContainer>
    )
  }
)
Img.displayName = 'Img'

// Fullscreen modal renders the shared image inside a container that spans the viewport.
type FullscreenModalProps = {
  images: StaticImageData[]
  currentIndex: number
  onClose: () => void
  onNavigate: (newIndex: number) => void
}

const FullscreenModal = ({ images, currentIndex, onClose, onNavigate }: FullscreenModalProps) => {
  const image = images[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length)
      else if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length)
    },
    [currentIndex, images.length, onClose, onNavigate]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <ModalOverlay
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      aria-label="Image full screen view"
    >
      <MotionImageContainer layout layoutId={`image-${image.src}`}>
        <Image
          src={image}
          alt="Full screen view by Christian Anagnostou"
          blurDataURL={image.blurDataURL}
          placeholder="blur"
          layout="fill"
          objectFit="contain"
        />
      </MotionImageContainer>
      <CloseButton onClick={onClose} aria-label="Close full screen view">
        &times;
      </CloseButton>
      <NavButtonLeft
        onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
        aria-label="Previous image"
      >
        &#10094;
      </NavButtonLeft>
      <NavButtonRight onClick={() => onNavigate((currentIndex + 1) % images.length)} aria-label="Next image">
        &#10095;
      </NavButtonRight>
    </ModalOverlay>
  )
}

const ImageContainer = styled(motion.div)`
  position: relative;
  img {
    display: block;
    height: auto;
    width: 100%;
    border-radius: 5px;
  }
`

// The modal’s shared container now spans the full viewport.
const MotionImageContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  display: flex;
  flex-direction: column;
  gap: ${({ $numColumns }) => 20 - $numColumns * 1.5}px;
  flex: 1;
`

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
`

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
`

const NavButton = styled.button`
  position: fixed;
  top: 50%;
  background: transparent;
  border: none;
  font-size: 3rem;
  color: #fff;
  cursor: pointer;
  transform: translateY(-50%);
  padding: 0 10px;
`

const NavButtonLeft = styled(NavButton)`
  left: 20px;
`

const NavButtonRight = styled(NavButton)`
  right: 20px;
`

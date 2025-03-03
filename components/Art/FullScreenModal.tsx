import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArtImage } from '../../lib/art'
import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'

interface FullscreenModalProps {
  images: ArtImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (newIndex: number) => void
}

const deltaX = 25
const duration = 0.25
const imageVariants = {
  initial: (direction: number) => ({
    x: direction ? direction * deltaX : 0,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration },
  },
  exit: (direction: number) => ({
    x: direction ? direction * -deltaX : 0,
    opacity: 0,
    transition: { duration },
  }),
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  const image = images[currentIndex]
  const formattedDate = dayjs(image.date).format("MMM 'YY") // e.g., "Jan '23"
  const [direction, setDirection] = useState(0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') {
        setDirection(-1)
        onNavigate((currentIndex - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        setDirection(1)
        onNavigate((currentIndex + 1) % images.length)
      }
    },
    [currentIndex, images.length, onClose, onNavigate]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <ModalOverlay>
      <AnimatePresence custom={direction} mode="wait">
        <MetadataArea
          key={currentIndex}
          custom={direction}
          variants={imageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <p>{image.title}</p>
          <p>{formattedDate}</p>
        </MetadataArea>
      </AnimatePresence>

      <ImageArea>
        <AnimatePresence custom={direction} mode="wait">
          <MotionImageContainer
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Image
              onClick={(e) => e.stopPropagation()}
              src={image.image}
              alt={`${image.title} - ${formattedDate}`}
              fill
              quality={100}
              sizes="100vw"
              unoptimized
              style={{ objectFit: 'contain' }}
            />
          </MotionImageContainer>
        </AnimatePresence>
      </ImageArea>
      <BottomBar>
        <button
          onClick={() => {
            setDirection(-1)
            onNavigate((currentIndex - 1 + images.length) % images.length)
          }}
          aria-label="Previous image"
        >
          <LeftArrow />
        </button>
        <button onClick={onClose} aria-label="Close full screen view">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
          </svg>
        </button>
        <button
          onClick={() => {
            setDirection(1)
            onNavigate((currentIndex + 1) % images.length)
          }}
          aria-label="Next image"
        >
          <RightArrow />
        </button>
      </BottomBar>
    </ModalOverlay>
  )
}

export default FullscreenModal

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`

const ImageArea = styled.div`
  flex: 1;
  position: relative;
`

const MotionImageContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 800px;
  margin: auto;
`

const MetadataArea = styled(motion.div)`
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  font-size: 0.9rem;
  p {
    color: var(--text-dark);
  }
`

const BottomBar = styled.div`
  height: 120px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  gap: 1rem;

  button {
    color: var(--text-dark);
    font-size: 1.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    flex: 1;
    height: 100%;
  }
`

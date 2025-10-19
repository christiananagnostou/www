import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import type { ArtImage } from '../../lib/art'
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
          animate="animate"
          custom={direction}
          exit="exit"
          initial="initial"
          variants={imageVariants}
        >
          <p>{image.title}</p>
          <p>{formattedDate}</p>
        </MetadataArea>
      </AnimatePresence>

      <ImageArea>
        <AnimatePresence custom={direction} mode="wait">
          <MotionImageContainer
            key={currentIndex}
            animate="animate"
            custom={direction}
            exit="exit"
            initial="initial"
            variants={imageVariants}
          >
            <Image
              alt={`${image.title} - ${formattedDate}`}
              fill
              quality={100}
              sizes="100vw"
              src={image.image}
              style={{ objectFit: 'contain' }}
              unoptimized
              onClick={(e) => e.stopPropagation()}
            />
          </MotionImageContainer>
        </AnimatePresence>
      </ImageArea>
      <BottomBar>
        <button
          aria-label="Previous image"
          onClick={() => {
            setDirection(-1)
            onNavigate((currentIndex - 1 + images.length) % images.length)
          }}
        >
          <LeftArrow />
        </button>
        <button aria-label="Close full screen view" onClick={onClose}>
          <svg
            fill="currentColor"
            height="1em"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z" />
          </svg>
        </button>
        <button
          aria-label="Next image"
          onClick={() => {
            setDirection(1)
            onNavigate((currentIndex + 1) % images.length)
          }}
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
  z-index: 10000;
  display: flex;
  flex-direction: column;
  background: rgb(0 0 0 / 95%);
  inset: 0;
`

const ImageArea = styled.div`
  position: relative;
  flex: 1;
`

const MotionImageContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin: auto;
  inset: 0;
`

const MetadataArea = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.9rem;
  p {
    color: var(--text-dark);
  }
`

const BottomBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 120px;
  padding: 0 1rem;
  border-top: 1px solid var(--accent);
  background: rgb(0 0 0 / 80%);

  button {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    color: var(--text-dark);
    cursor: pointer;
  }
`

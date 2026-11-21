import { AnimatePresence } from 'framer-motion'
import * as m from 'framer-motion/m'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import type { ArtImage } from '../../lib/art'
import { formatPhotoDate } from '../../lib/art/formatPhotoDate'
import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'

interface FullscreenModalProps {
  images: ArtImage[]
  initialIndex: number
  onClose: () => void
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

const FullscreenModal = ({ images, initialIndex, onClose }: FullscreenModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const image = images[currentIndex]
  const formattedDate = formatPhotoDate(image.date)
  const [direction, setDirection] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const navigate = (step: -1 | 1) => {
    setDirection(step)
    setCurrentIndex((current) => (current + step + images.length) % images.length)
  }

  useEffect(() => {
    const element = dialog.current
    const opener = document.activeElement
    element?.showModal()
    return () => {
      element?.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [])

  return (
    <ModalOverlay
      ref={dialog}
      aria-label="Full screen photograph"
      onCancel={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          navigate(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
    >
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
        <AnimatePresence custom={direction}>
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
              loading="eager"
              sizes="(min-width: 800px) 800px, 100vw"
              src={image.image}
              style={{ objectFit: 'contain' }}
            />
          </MotionImageContainer>
        </AnimatePresence>
      </ImageArea>
      <BottomBar>
        <button aria-label="Previous image" onClick={() => navigate(-1)}>
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
        <button aria-label="Next image" onClick={() => navigate(1)}>
          <RightArrow />
        </button>
      </BottomBar>
    </ModalOverlay>
  )
}

export default FullscreenModal

const ModalOverlay = styled.dialog`
  position: fixed;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgb(0 0 0 / 95%);
  inset: 0;

  &[open] {
    display: flex;
  }

  &::backdrop {
    background: transparent;
  }
`

const ImageArea = styled.div`
  position: relative;
  flex: 1;
`

const MotionImageContainer = styled(m.div)`
  position: absolute;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin: auto;
  inset: 0;
`

const MetadataArea = styled(m.div)`
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

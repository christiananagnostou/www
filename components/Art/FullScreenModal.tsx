import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import type { ArtImage } from '../../lib/art'
import { formatPhotoDate } from '../../lib/art/formatPhotoDate'
import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'
import X from '../SVG/X'
import ViewerPhoto from './ViewerPhoto'

interface FullscreenModalProps {
  images: ArtImage[]
  initialIndex: number
  onClose: () => void
}

type View = { requested: number; displayed: number | null; previous: number | null; direction?: 'next' | 'previous' }

const adjacentIndex = (index: number, step: -1 | 1, count: number) => (index + step + count) % count

export default function FullscreenModal({ images, initialIndex, onClose }: FullscreenModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [view, setView] = useState<View>({ requested: initialIndex, displayed: null, previous: null })
  const visible = view.displayed ?? view.requested
  const photo = images[visible]
  const count = images.length
  const canNavigate = count > 1
  const pending = view.displayed !== view.requested
  const allowLookahead =
    canNavigate && !pending && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const target = allowLookahead ? adjacentIndex(visible, 1, count) : view.requested
  // Retain the last frame and one target. Stable DOM order lets a mid-transition reversal continue in place.
  const frames = [...new Set([view.previous, visible, target])]
    .filter((index) => index !== null)
    .toSorted((a, b) => a - b)

  const present = useCallback((index: number) => {
    setView((current) =>
      current.requested !== index || current.displayed === index
        ? current
        : { ...current, previous: current.displayed, displayed: index }
    )
  }, [])

  const navigate = (step: -1 | 1, repeat = false) => {
    if (!canNavigate) return
    setView((current) => ({
      ...current,
      requested: adjacentIndex(current.requested, step, count),
      direction: repeat ? undefined : step === 1 ? 'next' : 'previous',
    }))
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
          navigate(event.key === 'ArrowLeft' ? -1 : 1, event.repeat)
        }
      }}
    >
      <Metadata role="status" aria-atomic="true">
        <strong>{photo.title}</strong>
        <time dateTime={photo.date}>{formatPhotoDate(photo.date)}</time>
        <span>
          {visible + 1} of {count}
        </span>
      </Metadata>
      <Stage aria-busy={pending} data-direction={view.direction}>
        {frames.map((index) => (
          <ViewerPhoto
            key={images[index].id}
            index={index}
            photo={images[index]}
            requested={index === view.requested}
            visible={index === visible}
            onPresent={present}
          />
        ))}
      </Stage>
      <Controls>
        <button type="button" aria-label="Previous image" disabled={!canNavigate} onClick={() => navigate(-1)}>
          <LeftArrow />
        </button>
        <button type="button" aria-label="Close full screen view" onClick={onClose}>
          <X />
        </button>
        <button type="button" aria-label="Next image" disabled={!canNavigate} onClick={() => navigate(1)}>
          <RightArrow />
        </button>
      </Controls>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.dialog`
  --viewer-ease: cubic-bezier(0.23, 1, 0.32, 1);
  position: fixed;
  inset: 0;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  border: 0;
  background: var(--dark-bg);
  color: var(--text);

  &[open] {
    display: flex;
  }

  > * {
    width: 100%;
    max-width: var(--max-w-screen);
  }

  &::backdrop {
    background: transparent;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[open] {
      transition: opacity 200ms var(--viewer-ease);

      @starting-style {
        opacity: 0;
      }
    }
  }

  button:focus-visible {
    outline: 2px solid var(--heading);
    outline-offset: -2px;
  }
`

const Metadata = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-dark);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;

  strong {
    margin-right: auto;
    color: var(--heading);
    overflow-wrap: anywhere;
  }

  time,
  span {
    white-space: nowrap;
  }

  span {
    padding-left: 0.75rem;
    border-left: 1px solid var(--accent);
    font-weight: normal;
  }
`

const Stage = styled.div`
  --travel: clamp(1.5rem, 5vw, 3rem);
  --entry-x: var(--travel);
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: clip;

  &[data-direction='previous'] {
    --entry-x: calc(0px - var(--travel));
  }
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0.5rem;

  button {
    display: grid;
    place-items: center;
    width: 3.5rem;
    min-height: 44px;
    border: 0;
    border-radius: var(--border-radius-md);
    background: transparent;
    color: var(--text);
    cursor: pointer;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (hover: hover) {
    button:enabled:hover {
      background: var(--accent);
      color: var(--heading);
    }
  }

  button:disabled {
    opacity: 0.35;
    cursor: default;
  }
`

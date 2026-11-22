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

type View = { requested: number; displayed: number | null; previous: number | null }

export default function FullscreenModal({ images, initialIndex, onClose }: FullscreenModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [view, setView] = useState<View>({ requested: initialIndex, displayed: null, previous: null })
  const visible = view.displayed ?? view.requested
  const photo = images[visible]
  const count = images.length
  const allowLookahead =
    view.displayed === view.requested &&
    count > 1 &&
    !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const target = allowLookahead ? (visible + 1) % count : view.requested
  // Keep the last displayed frame for the fade/back button. Only the forward neighbor is speculative.
  const frames = [...new Set([view.previous, visible, target])].filter((index) => index !== null)

  const present = useCallback((index: number) => {
    setView((current) =>
      current.requested !== index || current.displayed === index
        ? current
        : { ...current, previous: current.displayed, displayed: index }
    )
  }, [])

  const navigate = (step: -1 | 1) => {
    if (count > 1) setView((current) => ({ ...current, requested: (current.requested + step + count) % count }))
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
      <Metadata role="status" aria-atomic="true">
        <strong>{photo.title}</strong>
        <time dateTime={photo.date}>{formatPhotoDate(photo.date)}</time>
        <span>
          {visible + 1} of {count}
        </span>
      </Metadata>
      <Stage aria-busy={view.displayed !== view.requested}>
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
        <button type="button" aria-label="Previous image" disabled={count < 2} onClick={() => navigate(-1)}>
          <LeftArrow />
        </button>
        <button type="button" aria-label="Close full screen view" onClick={onClose}>
          <X />
        </button>
        <button type="button" aria-label="Next image" disabled={count < 2} onClick={() => navigate(1)}>
          <RightArrow />
        </button>
      </Controls>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.dialog`
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

  &::backdrop {
    background: var(--dark-bg);
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
  width: 100%;
  max-width: var(--max-w-screen);
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
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: var(--max-w-screen);
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: var(--max-w-screen);
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

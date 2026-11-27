import { useCallback, useEffect, useRef, useState } from 'react'

import type { ArtImage } from '../../lib/art'
import { formatPhotoDate } from '../../lib/art/formatPhotoDate'
import LeftArrow from '../SVG/LeftArrow'
import RightArrow from '../SVG/RightArrow'
import X from '../SVG/X'
import ViewerPhoto from './ViewerPhoto'

import styles from './FullScreenModal.module.css'

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
    <dialog
      className={styles.modalOverlay}
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
      <div className={styles.metadata} role="status" aria-atomic="true">
        <strong>{photo.title}</strong>
        <time dateTime={photo.date}>{formatPhotoDate(photo.date)}</time>
        <span>
          {visible + 1} of {count}
        </span>
      </div>
      <div className={styles.stage} aria-busy={pending} data-direction={view.direction}>
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
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous image" disabled={!canNavigate} onClick={() => navigate(-1)}>
          <LeftArrow />
        </button>
        <button type="button" aria-label="Close full screen view" onClick={onClose}>
          <X />
        </button>
        <button type="button" aria-label="Next image" disabled={!canNavigate} onClick={() => navigate(1)}>
          <RightArrow />
        </button>
      </div>
    </dialog>
  )
}

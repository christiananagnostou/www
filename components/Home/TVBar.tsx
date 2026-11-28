import { useEffect, useRef, useState } from 'react'

import { useWindowSize } from '../Hooks'
import StarBG from './StarBG'

import styles from './TVBar.module.css'

const Sections = [
  'craft',
  'create',
  'improve',
  'imbue',
  'listen',
  'learn',
  'teach',
  'smile',
  'retry',
  'practice',
  'persist',
  'stand',
  'exercise',
  'give',
  'laugh',
  'liven',
  'explore',
  'grow',
  'adapt',
  'communicate',
  'connect',
  'reflect',
  'inspire',
  'dream',
  'achieve',
  'collaborate',
  'appreciate',
  'embrace',
  'forgive',
  'discover',
  'transform',
]

interface Props {
  onBarFilled: (filled: boolean) => void
}

const BAR_GRADIENT = 'linear-gradient(to right, rgb(80 80 95), rgb(200 200 200 / 20%))'

const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
}

const TVBar = ({ onBarFilled }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const barFillRef = useRef<HTMLDivElement>(null)
  const currentPosition = useRef(0)
  const barFullRef = useRef(false)
  const dragStart = useRef({ clientX: 0, position: 0 })

  const { width } = useWindowSize()

  const [sectionIndex, setSectionIndex] = useState(0)
  const [isBarFull, setIsBarFull] = useState(false)

  const updateBarPosition = (position: number) => {
    if (!knobRef.current || !barsRef.current || !barFillRef.current) return
    const barsContainerWidth = barsRef.current.clientWidth
    if (!barsContainerWidth) return

    const nextPosition = Math.max(Math.min(position, barsContainerWidth), 0)
    const percentToFull = (nextPosition / barsContainerWidth) * 100
    currentPosition.current = nextPosition

    knobRef.current.style.rotate = `${(percentToFull / 100) * 360}deg`
    barFillRef.current.style.transform = `translateX(${percentToFull - 100}%)`
    const isFull = nextPosition === barsContainerWidth
    if (barFullRef.current !== isFull) {
      barFullRef.current = isFull
      setIsBarFull(isFull)
    }
  }

  const onDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragStart.current = { clientX: event.clientX, position: currentPosition.current }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    updateBarPosition(dragStart.current.position + event.clientX - dragStart.current.clientX)
  }

  useEffect(() => {
    onBarFilled(isBarFull)
  }, [isBarFull, onBarFilled])

  return (
    <>
      <div className={styles.tVControls}>
        <div
          className={styles.knob}
          onPointerCancel={endPointerDrag}
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={endPointerDrag}
        >
          <div ref={knobRef} className="knob" style={{ filter: isBarFull ? 'brightness(90%)' : 'brightness(100%)' }} />
        </div>

        <div
          ref={barsRef}
          className={styles.barWrap}
          onPointerCancel={endPointerDrag}
          onPointerDown={(width ?? Number.POSITIVE_INFINITY) < 768 ? onDragStart : undefined}
          onPointerMove={onDragMove}
          onPointerUp={endPointerDrag}
        >
          <div className="bar">
            <div ref={barFillRef} className={styles.barInner} style={{ background: BAR_GRADIENT }} />
          </div>
        </div>

        <div className="current-control">
          <button
            className={`button ${isBarFull ? 'highlight' : ''}`}
            disabled={!isBarFull}
            style={{ width: Sections[sectionIndex].length * 10 }}
            onClick={() => setSectionIndex((prev) => (prev === Sections.length - 1 ? 0 : prev + 1))}
          >
            {Sections.map((section) => (
              <span
                key={section}
                className="inner"
                style={Sections[sectionIndex] === section ? { top: 0, opacity: 1 } : { top: '150%', opacity: 0 }}
              >
                {section}
              </span>
            ))}
          </button>
        </div>
      </div>

      <StarBG show={isBarFull} />
    </>
  )
}

export default TVBar

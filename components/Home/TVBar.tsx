import { motion, PanInfo } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useWindowSize } from '../Hooks'
import StarBG from './StarBG'

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

type Props = {
  onBarFilled: (filled: boolean) => void
}

const BarGradient = 'linear-gradient(to right, rgb(80,80,95), rgba(200, 200, 200, 0.2)'

const TVBar = ({ onBarFilled }: Props) => {
  const knobRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { width } = useWindowSize()

  const [sectionIndex, setSectionIndex] = useState(0)
  const [percentToFull, setPercentToFull] = useState(0)
  const isBarFull = percentToFull === 100

  const onKnobPan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!knobRef.current || !barsRef.current || !buttonRef.current) return
    const barsContainerWidth = barsRef.current.clientWidth

    const prevPos = parseFloat(knobRef.current.dataset.currentDeg || '0')
    const newPos = Math.max(Math.min(prevPos + info.delta.x, barsContainerWidth), 0)

    const percentToFull = (newPos / barsContainerWidth) * 100

    setPercentToFull(percentToFull)

    knobRef.current.style.rotate = (percentToFull / 100) * 360 + 'deg'
    knobRef.current.dataset.currentDeg = newPos.toString()
  }

  useEffect(() => {
    onBarFilled(isBarFull)
  }, [isBarFull, onBarFilled])

  return (
    <>
      <TVControls>
        <Knob onPan={onKnobPan}>
          <div className="knob" ref={knobRef} style={{ filter: isBarFull ? 'brightness(90%)' : 'brightness(100%)' }} />
        </Knob>

        <motion.div className="bar-wrap" ref={barsRef} onPan={(width || 0) < 768 ? onKnobPan : () => {}}>
          <div className="bar">
            <div
              className="bar-inner"
              style={{
                left: -(100 - percentToFull) + '%',
                background: BarGradient,
              }}
            />
          </div>
        </motion.div>

        <div className="current-control">
          <motion.button
            className={`button ${isBarFull ? 'highlight' : ''}`}
            ref={buttonRef}
            onClick={
              isBarFull ? () => setSectionIndex((prev) => (prev === Sections.length - 1 ? 0 : prev + 1)) : () => {}
            }
            disabled={!isBarFull}
            style={{ width: Sections[sectionIndex].length * 10 }}
          >
            {Sections.map((section) => (
              <span
                className="inner"
                key={section}
                style={Sections[sectionIndex] === section ? { top: 0, opacity: 1 } : { top: '150%', opacity: 0 }}
              >
                {section}
              </span>
            ))}
          </motion.button>
        </div>
      </TVControls>

      <StarBG show={isBarFull} />
    </>
  )
}

export default TVBar

const Knob = styled(motion.div)`
  --knob-border-width: 1px;
  --knob-size: 24px;

  --s: rgb(58, 59, 65);
  --s1: rgb(42, 44, 50);
  --s2: rgb(54, 56, 60);
  --s3: rgb(30, 31, 34);
  --s4: rgb(24, 26, 32);

  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  cursor: ew-resize;
  rotate: 0deg;

  margin-right: var(--item-spacing);
  position: relative;
  border-radius: 50%;
  width: var(--knob-size);
  height: var(--knob-size);
  background: linear-gradient(to top, var(--s3), var(--s2));
  box-shadow: 0 1px 3px rgb(0, 0, 0);
  padding: var(--knob-border-width);

  .knob {
    height: 100%;
    width: 100%;
    /* Prevent 1px shift */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1, 1);
    transform: translateZ(0) scale(1, 1);

    transition: filter 2s ease;

    border-radius: 50%;
    background: linear-gradient(
      90deg,
      var(--s2) 10%,
      var(--s4) 40.8%,
      var(--s) 42%,
      var(--s) 58%,
      var(--s1) 59.2%,
      var(--s2) 90%
    );
    box-shadow: 0 0.1em 0.2em 0 rgba(var(--s1), 0.9) inset, 0 -0.1em 0.3em 0 rgba(var(--s1), 0.3) inset,
      0 0.08em 0.3em 0 rgba(#000011, 0.3), 0.5em 0 1em 0 rgba(var(--s1), 0.5) inset,
      -0.5em 0 1em 0 rgba(var(--s4), 0.3) inset, 0 4em 1em -3.5em rgba(#000022, 0.3);
  }

  .knob::before {
    content: '';
    position: absolute;
    left: calc((var(--knob-size) / 2) - 2px);
    width: 2px;
    height: 30%;
    border-radius: 0 0 1px 1px;
    background: rgba(187, 68, 68, 0.75);
  }
`

const TVControls = styled(motion.div)`
  width: calc(100% - 2rem);
  display: flex;
  align-items: stretch;
  position: relative;
  position: absolute;
  bottom: 0;
  transform: translateY(calc(50% + 0.5px));
  left: 1rem;

  user-select: none;
  * {
    user-select: none;
  }

  .bar-wrap {
    display: flex;
    align-items: center;
    flex: 1;

    .bar {
      width: 100%;
      background: var(--accent);
      position: relative;
      overflow: hidden;
      height: 0.5px;

      .bar-inner {
        position: absolute;
        left: -100%;
        height: 100%;
        width: 100%;
      }
    }
  }

  .button {
    display: block;
    height: 100%;
    background: var(--body-bg);
    border: 1px solid var(--accent);
    border-radius: 4px;
    padding: 0 1rem;
    min-width: 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
    cursor: not-allowed;

    .inner {
      color: #888888;
      font-weight: 200;
      font-size: 0.9rem;
      line-height: 1rem;
      display: grid;
      place-items: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all 0.5s ease;
      opacity: 0 !important;
    }

    &.highlight {
      cursor: pointer;

      .inner {
        color: rgba(255, 255, 255, 0.9);
        opacity: 1 !important;
      }
    }
  }
`

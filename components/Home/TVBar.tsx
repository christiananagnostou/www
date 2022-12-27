import { motion, PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fade, staggerFadeFast } from "../animation";
import { useWindowSize } from "../Hooks";

type Props = {};

const Sections = [
  "craft",
  "imbue",
  "clarify",
  "improve",
  "grow",
  "listen",
  "learn",
  "teach",
  "smile",
  "retry",
  "exhale",
  "practice",
  "enhance",
  "persist",
];

const MaxTVBars = 80;

const TVBar = (props: Props) => {
  const ticksRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { width } = useWindowSize();

  const [isBarFull, setIsBarFull] = useState(false);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [numTVBars, setNumTVBars] = useState(MaxTVBars);

  useEffect(() => {
    if (width) setNumTVBars(Math.min(Math.floor(width / 15), MaxTVBars));
  }, [width]);

  const onKnobPan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!ticksRef.current || !barsRef.current || !buttonRef.current) return;
    const barsContainerWidth = barsRef.current.clientWidth;

    const prevPos = parseFloat(ticksRef.current.dataset.currentDeg || "0");
    const newPos = Math.max(Math.min(prevPos + info.delta.x, barsContainerWidth), 0);

    const isBarFull = newPos === barsContainerWidth;
    setIsBarFull(isBarFull);

    ticksRef.current.style.rotate = newPos + "deg";
    ticksRef.current.dataset.currentDeg = newPos.toString();

    Array.from(barsRef.current.children as HTMLCollectionOf<HTMLElement>).forEach(
      (bar, i) =>
        (bar.style.background =
          i / numTVBars < newPos / barsContainerWidth ? "white" : "var(--accent)")
    );
  };

  return (
    <TVControls variants={staggerFadeFast}>
      <Knob variants={fade} onPan={onKnobPan}>
        <span className="inner">
          <span className="point" />
          <span className="ticks" ref={ticksRef}>
            {[...new Array(4)].map((_, i) => (
              <KnobTick index={i} key={i} />
            ))}
          </span>
        </span>
      </Knob>

      <motion.div className="grill" ref={barsRef} onPan={(width || 0) < 768 ? onKnobPan : () => {}}>
        {[...new Array(numTVBars)].map((_, i) => (
          <Bar
            key={i + "_" + numTVBars}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 0.5, transition: { duration: 0.5, ease: "ease" } },
            }}
          />
        ))}
      </motion.div>

      <div className="current-control">
        <motion.button
          className={`label ${isBarFull ? "highlight" : ""}`}
          variants={fade}
          ref={buttonRef}
          onClick={
            isBarFull
              ? () => setSectionIndex((prev) => (prev === Sections.length - 1 ? 0 : prev + 1))
              : () => {}
          }
          disabled={!isBarFull}
        >
          {Sections.map((section) => (
            <span
              className="inner"
              key={section}
              style={
                Sections[sectionIndex] === section
                  ? { top: 0, opacity: 1 }
                  : { top: "150%", opacity: 0 }
              }
            >
              {section}
            </span>
          ))}
        </motion.button>
      </div>
    </TVControls>
  );
};

export default TVBar;

const KnobTick = styled.span<{ index: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: block;
  height: calc(100% - 2px);
  width: 1px;
  background: rgba(0, 0, 0, 0.25);
  rotate: ${({ index }) => `${index * (360 / 8)}deg`};
`;

const Knob = styled(motion.div)`
  border-radius: 50%;
  overflow: hidden;
  padding: 1.5px;
  height: 24px;
  width: 24px;
  margin-right: var(--item-spacing);
  box-shadow: inset 0 0 2px -1px var(--accent);
  background: linear-gradient(45deg, rgba(100, 100, 100, 0.1), var(--accent));
  rotate: 1deg;
  cursor: ew-resize;
  position: relative;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  .ticks {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    rotate: 0deg;
  }

  .inner {
    width: 100%;
    height: 100%;
    padding: 3.5px;
    display: block;
    border-radius: inherit;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    background: linear-gradient(45deg, rgba(100, 100, 100, 0.1), var(--accent));

    .point {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: block;
      border-radius: inherit;
      box-shadow: inset 0 0 1px var(--body-bg), -1px 1px 3px rgba(0, 0, 0, 0.2);
      background: linear-gradient(45deg, var(--body-bg), var(--accent));
    }
  }
`;

const TVControls = styled(motion.div)`
  --item-spacing: 4px;

  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: stretch;

  user-select: none;
  * {
    user-select: none;
  }

  .grill {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .current-control {
    display: flex;
    align-items: stretch;
    gap: var(--item-spacing);

    .label {
      height: 100%;
      background: rgba(20, 20, 20, 0.5);
      border: 1px solid var(--accent);
      border-radius: 3px;
      padding: 0 1rem;
      min-width: 90px;
      text-align: center;
      position: relative;
      overflow: hidden;
      cursor: not-allowed;

      .inner {
        color: #888;
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
      }

      &.highlight {
        border: 1px solid #888;
        cursor: pointer;

        .inner {
          color: white;
        }
      }
    }
  }
`;

const Bar = styled(motion.span)`
  display: block;
  height: 100%;
  width: auto;
  position: relative;
  flex: 1;
  margin-right: var(--item-spacing);
  opacity: 0.5;
  background: var(--accent);
  border-radius: 1px;

  .highlight {
    color: rgb(237, 172, 93);
  }
`;

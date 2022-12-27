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
  const knobRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { width } = useWindowSize();

  const [isBarFull, setIsBarFull] = useState(false);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [numTVBars, setNumTVBars] = useState(MaxTVBars);

  useEffect(() => {
    if (width) setNumTVBars(Math.min(Math.floor(width / 15), MaxTVBars)); // 15 makes the bar width look good
  }, [width]);

  const onKnobPan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!knobRef.current || !barsRef.current || !buttonRef.current) return;
    const barsContainerWidth = barsRef.current.clientWidth;

    const prevPos = parseFloat(knobRef.current.dataset.currentDeg || "0");
    const newPos = Math.max(Math.min(prevPos + info.delta.x, barsContainerWidth), 0);

    const isBarFull = newPos === barsContainerWidth;
    setIsBarFull(isBarFull);

    knobRef.current.style.rotate = newPos + "deg";
    knobRef.current.dataset.currentDeg = newPos.toString();

    Array.from(barsRef.current.children as HTMLCollectionOf<HTMLElement>).forEach(
      (bar, i) =>
        (bar.style.background =
          i / numTVBars < newPos / barsContainerWidth ? "white" : "var(--accent)")
    );
  };

  return (
    <TVControls variants={staggerFadeFast}>
      <Knob variants={fade} onPan={onKnobPan} ref={knobRef}>
        <div className="knob" />
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

const Knob = styled(motion.div)`
  --knob-border-width: 2px;
  --knob-tick-width: 4px;
  --knob-size: 24px;

  --s: rgb(193, 187, 174);
  --s1: rgb(240, 220, 205);
  --s2: rgb(200, 194, 181);
  --s3: rgb(189, 183, 171);
  --s4: rgb(157, 142, 124);

  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
  cursor: ew-resize;
  rotate: 0deg;

  margin-right: var(--item-spacing);
  position: relative;
  border-radius: 50%;
  width: var(--knob-size);
  height: var(--knob-size);
  background: linear-gradient(to top, #c6c6c6, #ededed);

  .knob {
    position: absolute;
    width: calc(var(--knob-size) - var(--knob-border-width));
    height: calc(var(--knob-size) - var(--knob-border-width));
    top: calc((var(--knob-border-width) / 2));
    left: calc((var(--knob-border-width) / 2));
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
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
    box-shadow: 0 0.1em 0.2em 0 rgba(var(--s1), 0.9) inset,
      0 -0.1em 0.3em 0 rgba(var(--s1), 0.3) inset, 0 0.08em 0.3em 0 rgba(#001, 0.3),
      0.5em 0 1em 0 rgba(var(--s1), 0.5) inset, -0.5em 0 1em 0 rgba(var(--s4), 0.3) inset,
      0 4em 1em -3.5em rgba(#002, 0.3);
  }

  .knob::before {
    position: absolute;
    content: "";
    left: calc((var(--knob-size) / 2) - 1px);
    width: 1px;
    height: 30%;
    border-radius: 0 0 1px 1px;
    background: #b44;
    /* box-shadow: -0.05em 0 0.1em 0 var(--s1), -0.05em 0 0.1em 0 rgba(#000, 0.4) inset; */
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
      border-radius: 4px;
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

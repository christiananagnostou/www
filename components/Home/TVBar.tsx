import { motion, PanInfo } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fade, staggerFadeFast } from "../animation";
import { useWindowSize } from "../Hooks";
import StarBG from "./StarBG";

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
const BarHeight = 24;

type Color = {
  r: number;
  g: number;
  b: number;
};

const GColor = (r?: number, g?: number, b?: number): Color => {
  r = typeof r === "undefined" ? 0 : r;
  g = typeof g === "undefined" ? 0 : g;
  b = typeof b === "undefined" ? 0 : b;
  return { r: r, g: g, b: b };
};

const createColorRange = (c1: Color, c2: Color) => {
  var colorList = [],
    tmpColor;
  for (var i = 0; i < 255; i++) {
    tmpColor = GColor();
    tmpColor.r = c1.r + (i * (c2.r - c1.r)) / 255;
    tmpColor.g = c1.g + (i * (c2.g - c1.g)) / 255;
    tmpColor.b = c1.b + (i * (c2.b - c1.b)) / 255;
    colorList.push(tmpColor);
  }
  return colorList;
};

const BarColorRange = createColorRange({ r: 80, g: 80, b: 95 }, { r: 125, g: 125, b: 140 });

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

    const percentToFull = newPos / barsContainerWidth;

    const isBarFull = newPos === barsContainerWidth;
    setIsBarFull(isBarFull);

    // const { r, g, b } = BarColorRange[Math.floor(percentToFull * (BarColorRange.length - 1))];
    // knobRef.current.style.color = `rgb(${r},${g},${b})`;
    // knobRef.current.style.left =
    //   Math.min(newPos, barsContainerWidth - BarHeight + BarHeight / 2 - 6) + "px";
    knobRef.current.style.rotate = percentToFull * 360 + "deg";
    knobRef.current.dataset.currentDeg = newPos.toString();

    Array.from(barsRef.current.children as HTMLCollectionOf<HTMLElement>).forEach((bar, i) => {
      const { r, g, b } =
        BarColorRange[
          Math.floor((i / barsRef.current!.children.length) * (BarColorRange.length - 1))
        ];
      const barColor = `rgb(${r},${g},${b})`;
      const isBarHiglighted = i / numTVBars < percentToFull;

      bar.style.background = isBarHiglighted ? barColor : "var(--accent)";
    });
  };

  return (
    <>
      <TVControls variants={staggerFadeFast}>
        <Knob variants={fade} onPan={onKnobPan} ref={knobRef}>
          <div className="knob" />
        </Knob>

        <motion.div
          className="grill"
          ref={barsRef}
          onPan={(width || 0) < 768 ? onKnobPan : () => {}}
        >
          {[...new Array(numTVBars)].map((_, i) => (
            <Bar key={i + "_" + numTVBars} variants={fade} />
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

      <Signature
        src="/signature.png"
        style={
          isBarFull
            ? { opacity: 1, transition: "opacity 2s 2s ease" }
            : { opacity: 0, transition: "opacity 0.3s ease" }
        }
        height={70}
        width={150}
        alt="Signature of Christian Anagnostou"
      />

      <StarBG show={isBarFull} />
    </>
  );
};

export default TVBar;

const Signature = styled(Image)`
  margin: 1rem 0 0 auto;
  pointer-events: none;
  user-select: none;
`;

const Knob = styled(motion.div)`
  --knob-border-width: 1px;
  --knob-size: 24px;

  --s: rgb(77, 79, 87);
  --s1: rgb(56, 59, 67);
  --s2: rgb(72, 74, 80);
  --s3: rgb(40, 41, 45);
  --s4: rgb(32, 34, 42);

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
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0);
  padding: var(--knob-border-width);

  .knob {
    height: 100%;
    width: 100%;
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
    width: 2px;
    height: 30%;
    border-radius: 0 0 1px 1px;
    background: rgba(187, 68, 68, 0.75);
  }
`;

const TVControls = styled(motion.div)`
  --item-spacing: 4px;
  --bar-height: ${BarHeight}px;

  padding: 0.5rem 0;
  width: 100%;
  display: flex;
  align-items: stretch;
  position: relative;

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
    height: var(--bar-height);

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
      transition: all 0.5s ease;
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
        opacity: 0 !important;
      }

      &.highlight {
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: inset 0 1px 3px rgba(200, 200, 200, 0.2), inset 0 -1px 3px rgba(0, 0, 0, 0.5);
        cursor: pointer;

        .inner {
          color: rgba(255, 255, 255, 0.9);
          opacity: 1 !important;
        }
      }
    }
  }
`;

const Bar = styled(motion.span)`
  display: block;
  height: 2px;
  width: auto;
  position: relative;
  flex: 1;
  margin-right: var(--item-spacing);
  background: var(--accent);
`;

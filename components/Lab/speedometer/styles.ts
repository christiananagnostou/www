import { motion } from 'framer-motion'
import styled from 'styled-components'

/* 
DIAL 
*/
export const DialShell = styled.div<{ $size: number }>`
  --diameter: ${({ $size }) => $size}px;
  --border-width: 3px;

  position: relative;
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;

  /* Enhanced inner gloss and metallic look with off-center highlights */
  background:
    radial-gradient(circle at 50% 50%, var(--white-10) 0%, transparent 70%),
    radial-gradient(circle at 50% 50%, var(--gray-dark) 0%, var(--gray-darker) 70%);

  box-shadow: inset 0 0 0 var(--border-width) var(--gray-medium);
  overflow: hidden;

  /* Pseudo-element for inward arching bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 15%; /* Adjust this value to control the depth of the arch */
    border-top: var(--border-width) solid var(--gray-medium);
    background: var(--dark-bg); /* Match the dashboard background */
    border-top-left-radius: 100% 200%;
    border-top-right-radius: 100% 200%;
  }
`

export const RedlineArc = styled.div<{ $size: number; $start: number; $end: number }>`
  position: absolute;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent ${({ $start }) => $start}deg,
    var(--accent-light) ${({ $start }) => $start}deg ${({ $end }) => $end}deg,
    transparent ${({ $end }) => $end}deg
  );
  filter: drop-shadow(0 0 4px var(--accent-light));
  pointer-events: none;
  inset: 0;
  mask-image: radial-gradient(
    circle,
    transparent 0,
    transparent ${({ $size }) => $size * 0.3}px,
    // Start of visible ring
    var(--black) calc(${({ $size }) => $size / 2}px - var(--border-width)),
    // End of visible ring
    transparent calc(${({ $size }) => $size / 2}px - var(--border-width) + 1px),
    // Start of outer transparent
    transparent 100%
  );
`

export const Tick = styled.div<{ $major: boolean; $len: number }>`
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 1px;
  height: ${({ $len }) => $len}px;
  background: ${({ $major }) => ($major ? 'var(--off-white)' : 'var(--accent-dim)')};
  transform-origin: center;
  translate: -50% 50%;
`

export const Label = styled.span`
  position: absolute;
  bottom: 50%;
  left: 50%;
  font-weight: bold;
  font-size: 0.65rem;
  color: var(--off-white);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  translate: -50% 50%;
`

export const Marker = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--off-white);
  filter: drop-shadow(0 0 2px var(--off-white));
  transform-origin: center;
  translate: -50% 50%;
`

export const Needle = styled(motion.div)`
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 4px;
  height: 45%;
  border-radius: 50% 50% 20% 20%;
  background: var(--needle-color);
  filter: drop-shadow(0 0 2px var(--needle-color));
  transform-origin: 50% 100%; /* Rotate from the bottom center of the needle */
  translate: -50% 0;

  &::before {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    z-index: 1;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--gray-light);
    transform: translate(-50%, -50%);
  }
`

/* 
READOUT
*/
export const Readout = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  line-height: 1.2;
  text-align: left;
`
export const SpeedText = styled.span`
  font-size: 1rem;
  color: var(--off-white);
`
export const ThrottleText = styled.span`
  font-size: 0.9rem;
  color: var(--text-dark);
`

/* 
PEDAL 
*/
export const PedalBtn = styled(motion.button)`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--pedal-w);
  height: var(--pedal-h);
  padding: 0.5rem;
  border: none;

  border-radius: 5px;
  background: var(--accent);
  cursor: pointer;
  perspective: 900px;
`

export const PedalFace = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border: 3px solid #222222;
  border-radius: 10px;
  background: linear-gradient(145deg, #555555, #333333);
  box-shadow:
    inset 0 0 12px rgb(0 0 0 / 70%),
    0 4px 8px rgb(0 0 0 / 50%);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgb(255 255 255 / 10%) 10px,
      rgb(255 255 255 / 10%) 20px
    );
  }
`

export const ThrottleBar = styled.div<{ throttle: number }>`
  position: absolute;
  right: calc(0.5rem + var(--pedal-w) + 0.5rem);
  bottom: 0.5rem;
  width: 8px;
  height: var(--pedal-h);
  border-radius: 5px;
  background: var(--gray-dark);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${({ throttle }) => throttle * 100}%;
    background: var(--accent-light);
  }
`

/* 
LAYOUT 
*/
export const DashboardPanel = styled.div<{ $size: number }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  --pedal-w: 80px;
  --pedal-h: 120px;
  --accent-light: #be4242;
  --accent-dim: #555555;
  --white-10: rgb(255 255 255 / 10%);
  --off-white: #d6d6d6;
  --gray-dark: #333333;
  --gray-darker: #111111;
  --gray-medium: #444444;
  --gray-light: #b7b7b7;
  --black: #000000;
  --needle-color: #0091d9;
  --white: #ffffff;
  --shadow-color: rgb(0 0 0 / 70%);

  @media (width <= 600px) {
    --pedal-w: 60px;
    --pedal-h: 90px;

    padding-bottom: ${({ $size }) => $size * 0.3}px;
  }

  * {
    opacity: 1;
    user-select: none;
  }
`

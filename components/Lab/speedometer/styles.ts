import styled from 'styled-components'
import { motion } from 'framer-motion'

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
  overflow: hidden;

  /* Enhanced inner gloss and metallic look with off-center highlights */
  background:
    radial-gradient(circle at 50% 50%, var(--white-10) 0%, transparent 70%),
    radial-gradient(circle at 50% 50%, var(--gray-dark) 0%, var(--gray-darker) 70%);

  box-shadow: inset 0 0 0 var(--border-width) var(--gray-medium);

  /* Pseudo-element for inward arching bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15%; /* Adjust this value to control the depth of the arch */
    background: var(--dark-bg); /* Match the dashboard background */
    border-top: var(--border-width) solid var(--gray-medium);
    border-top-left-radius: 100% 200%;
    border-top-right-radius: 100% 200%;
    z-index: 1;
  }
`

export const RedlineArc = styled.div<{ $size: number; $start: number; $end: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent ${({ $start }) => $start}deg,
    var(--accent-light) ${({ $start }) => $start}deg ${({ $end }) => $end}deg,
    transparent ${({ $end }) => $end}deg
  );
  pointer-events: none;
  filter: drop-shadow(0 0 4px var(--accent-light));
  mask-image: radial-gradient(
    circle,
    transparent 0px,
    transparent ${({ $size }) => $size * 0.3}px,
    // Start of visible ring
    black calc(${({ $size }) => $size / 2}px - var(--border-width)),
    // End of visible ring
    transparent calc(${({ $size }) => $size / 2}px - var(--border-width) + 1px),
    // Start of outer transparent
    transparent 100%
  );
`

export const Tick = styled.div<{ $major: boolean; $len: number }>`
  position: absolute;
  left: 50%;
  bottom: 50%;
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
  color: var(--off-white);
  font-size: 0.65rem;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  translate: -50% 50%;
`

export const Marker = styled.div`
  position: absolute;
  left: 50%;
  bottom: 50%;
  width: 2px;
  height: 2px;
  background: var(--off-white);
  border-radius: 50%;
  transform-origin: center;
  translate: -50% 50%;
  filter: drop-shadow(0 0 2px var(--off-white));
`

export const Needle = styled(motion.div)`
  position: absolute;
  left: 50%;
  bottom: 50%;
  width: 4px;
  height: 45%;
  background: var(--needle-color);
  transform-origin: 50% 100%; /* Rotate from the bottom center of the needle */
  translate: -50% 0;
  filter: drop-shadow(0 0 2px var(--needle-color));
  border-radius: 50% 50% 20% 20%;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -15px;
    width: 15px;
    height: 15px;
    background: var(--gray-light);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
`

/* 
READOUT
*/
export const Readout = styled.div`
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  text-align: left;
  line-height: 1.2;
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
  width: var(--pedal-w);
  height: var(--pedal-h);
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;

  border-radius: 5px;
  border: none;
  background: var(--accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 900px;
  padding: 0.5rem;
`

export const PedalFace = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(145deg, #555555, #333333);
  border: 3px solid #222222;
  box-shadow:
    inset 0 0 12px rgba(0, 0, 0, 0.7),
    0 4px 8px rgba(0, 0, 0, 0.5);
  position: relative;
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
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    );
  }
`

export const ThrottleBar = styled.div<{ throttle: number }>`
  position: absolute;
  right: calc(0.5rem + var(--pedal-w) + 0.5rem);
  bottom: 0.5rem;
  width: 8px;
  height: var(--pedal-h);
  background: var(--gray-dark);
  border-radius: 5px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  --pedal-w: 80px;
  --pedal-h: 120px;
  --accent-light: #be4242;
  --accent-dim: #555555;
  --white-10: rgba(255, 255, 255, 0.1);
  --off-white: #d6d6d6;
  --gray-dark: #333333;
  --gray-darker: #111111;
  --gray-medium: #444444;
  --gray-light: #b7b7b7;
  --black: #000000;
  --needle-color: #0091d9;
  --white: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.7);

  @media (max-width: 600px) {
    --pedal-w: 60px;
    --pedal-h: 90px;

    padding-bottom: ${({ $size }) => $size * 0.3}px;
  }

  * {
    user-select: none;
    -webkit-user-select: none;
    opacity: 1;
  }
`

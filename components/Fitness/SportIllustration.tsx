import type { Sport } from '../../lib/fitness/training'
import styles from './Fitness.module.css'

const drawings = {
  swim: (
    <g transform="rotate(-15 58 28)">
      {[10, 26, 42, 58].map((y) => (
        <g key={y}>
          <path d={`M-8 ${y}h132`} opacity=".35" />
          <path d={`M-8 ${y}h132`} strokeWidth="2.7" strokeDasharray="2 3 2 3 2 12" />
        </g>
      ))}
      <g className={styles.swimmer}>
        <g fill="currentColor" strokeWidth="1.6">
          <circle cx="65" cy="33" r="2.4" />
          <path d="m62 34-8 1-7-3m12 2 4 5 9-2" fill="none" />
        </g>
        <path d="M35 34h7m-13 4h10" opacity=".55" />
      </g>
      <path d="M73 15h12m5 3h5" opacity=".55" />
    </g>
  ),
  bike: (
    <g transform="rotate(-8 58 28)">
      <path d="M30 21 72 8a19 19 0 1 1 3 38l-45-8a9 9 0 0 1 0-17Z" opacity=".75" />
      <path d="m32 23 40-12m-39 25 40 7" strokeDasharray="2 3" opacity=".55" />
      <circle cx="31" cy="29.5" r="7" strokeDasharray="2 1.3" strokeWidth="2.5" />
      <circle cx="31" cy="29.5" r="2" />
      <g className={styles.crank}>
        <circle cx="76" cy="27" r="15.5" strokeWidth="3" strokeDasharray="2 1" />
        <circle cx="76" cy="27" r="11.7" opacity=".5" />
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d="m76 23 1.5-6" transform={`rotate(${a} 76 27)`} strokeWidth="2.6" />
        ))}
        <path d="m67 43 9-16 9-16m-22 32h8m10-32h8" strokeWidth="2.5" />
        <circle cx="76" cy="27" r="2.4" fill="currentColor" />
      </g>
    </g>
  ),
  run: (
    <g transform="rotate(-15 58 28)">
      {[0, 4, 8, 12].map((i) => (
        <rect
          key={i}
          x={16 + i}
          y={4 + i}
          width={84 - i * 2}
          height={48 - i * 2}
          rx={24 - i}
          opacity={i === 0 || i === 12 ? 1 : 0.55}
        />
      ))}
      <path d="M65 4v12m4-12v12M41 40v12m4-12v12m4-12v12" opacity=".7" />
      <g className={styles.runner}>
        <path d="M77 11a17 17 0 0 1 10 5" strokeWidth="2.6" />
        <circle cx="88" cy="17" r="2.2" fill="currentColor" />
      </g>
    </g>
  ),
  other: (
    <>
      <g opacity=".55">
        <path d="M-3 29C15 29 19 5 40 8s23 22 43 20 23-15 38-15M-3 36C17 36 20 13 40 15s22 22 44 20 23-14 37-14M-3 44C18 43 24 22 40 23s24 23 45 20 22-13 36-13M-3 52C22 50 27 31 41 31s23 22 45 20" />
      </g>
      <path d="M10 46c16-3 21-22 30-22s14 9 25 3S78 11 95 12" strokeDasharray="2.5 3.5" />
      <circle className={styles.waypointRing} cx="95" cy="12" r="7" opacity="0" />
      <circle cx="95" cy="12" r="2.6" fill="currentColor" />
    </>
  ),
}

export default function SportIllustration({ sport }: { sport: Sport }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 116 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawings[sport]}
    </svg>
  )
}

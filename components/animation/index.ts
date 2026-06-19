import type { Variants } from 'framer-motion'

export const instant = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 1, transition: { duration: 0 } },
} as const

export const pageAnimation = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
} as const

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
} as const

export const staggerFade = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
} as const

export const photoAnim = {
  hidden: { scale: 1.06, opacity: 0.4 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4 },
  },
} as const

export const lineAnim = {
  hidden: { scaleX: 0.95, opacity: 0.8 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.4 } },
} as const

export const dropdown = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
} as const

export const menuAnimation = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
} as const

export const desktopSubmenuAnimation = {
  hidden: { opacity: 0, y: -5, pointerEvents: 'none' as const },
  show: { opacity: 1, y: 0, pointerEvents: 'auto' as const, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -5, pointerEvents: 'none' as const, transition: { duration: 0.15 } },
} as const

export type MotionPresets = {
  pageAnimation: Variants
  fade: Variants
  staggerFade: Variants
  photoAnim: Variants
  lineAnim: Variants
  dropdown: Variants
  menuAnimation: Variants
  desktopSubmenuAnimation: Variants
}

export const motionPresets: MotionPresets = {
  pageAnimation,
  fade,
  staggerFade,
  photoAnim,
  lineAnim,
  dropdown,
  menuAnimation,
  desktopSubmenuAnimation,
}

export const reducedMotionPresets: MotionPresets = {
  pageAnimation: instant,
  fade: instant,
  staggerFade: instant,
  photoAnim: instant,
  lineAnim: instant,
  dropdown: instant,
  menuAnimation: instant,
  desktopSubmenuAnimation: instant,
}

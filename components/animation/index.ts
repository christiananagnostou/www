import type { Variants } from 'framer-motion'

export const instant = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 1, transition: { duration: 0 } },
} as const

export const pageAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.1, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
} as const

export const pageExitAnimation = {
  exit: { opacity: 0, transition: { duration: 0.15 } },
} as const

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
} as const

export const staggerFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, staggerChildren: 0.06 },
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
  hidden: { width: '95%' },
  show: { width: '100%', transition: { duration: 0.4 } },
} as const

export const dropdown = {
  hidden: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1, transition: { duration: 0.2 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
} as const

export const menuAnimation = {
  hidden: { height: 0 },
  show: { height: 'auto', transition: { duration: 0.2, staggerChildren: 0.1 } },
  exit: { height: 0, transition: { duration: 0.2 } },
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

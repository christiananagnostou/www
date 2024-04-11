export const pageAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.1, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const staggerFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.06 },
  },
}

export const staggerFadeFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut', staggerChildren: 0.008 },
  },
}

export const photoAnim = {
  hidden: { scale: 1.06, opacity: 0.4 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { ease: 'easeOut', duration: 0.4 },
  },
}

export const lineAnim = {
  hidden: { width: '95%' },
  show: { width: '100%', transition: { ease: 'easeOut', duration: 0.4 } },
}

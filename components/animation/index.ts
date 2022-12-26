export const pageAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, staggerChildren: 0.25 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.07 },
  },
};

export const staggerFadeFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut", staggerChildren: 0.005 },
  },
};

export const photoAnim = {
  hidden: { scale: 1.1, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { ease: "easeOut", duration: 0.5 },
  },
};

export const lineAnim = {
  hidden: { width: "90%" },
  show: { width: "100%", transition: { ease: "easeOut", duration: 0.5 } },
};

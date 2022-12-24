import { useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

export const useScroll = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  isInView ? controls.start("show") : controls.start("hidden");

  return [ref, controls];
};

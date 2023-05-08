import { AnimationControls, useAnimation, useInView } from 'framer-motion'
import { MutableRefObject, useRef } from 'react'

export const useScroll = (): [MutableRefObject<HTMLElement | null>, AnimationControls] => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  isInView ? controls.start('show') : controls.start('hidden')

  return [ref, controls]
}

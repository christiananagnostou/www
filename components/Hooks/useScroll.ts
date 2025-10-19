import type { AnimationControls } from 'framer-motion'
import { useAnimation, useInView } from 'framer-motion'
import type { RefObject } from 'react'
import { useRef } from 'react'

export const useScroll = (): [RefObject<HTMLElement | null>, AnimationControls] => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  if (isInView) controls.start('show')
  else controls.start('hidden')

  return [ref, controls]
}

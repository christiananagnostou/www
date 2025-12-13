import { useAnimation, useInView } from 'framer-motion'
import { RefObject, useRef } from 'react'

export const useScroll = (): [RefObject<HTMLElement | null>, ReturnType<typeof useAnimation>] => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  isInView ? controls.start('show') : controls.start('hidden')

  return [ref, controls]
}

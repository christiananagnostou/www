import { useAnimation, useInView } from 'framer-motion'
import { type RefObject, useRef } from 'react'

export const useScroll = (): [RefObject<HTMLElement | null>, ReturnType<typeof useAnimation>] => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  if (isInView) {
    controls.start('show')
  } else {
    controls.start('hidden')
  }

  return [ref, controls]
}

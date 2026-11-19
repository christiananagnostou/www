import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { createContext, useContext, useEffect, useState } from 'react'

const PageTransitionContext = createContext<false | 'hidden'>(false)

interface Props {
  children: React.ReactNode
}

export const usePageTransitionInitial = () => useContext(PageTransitionContext)

const MotionProvider = ({ children }: Props) => {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => setHasHydrated(true), [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <PageTransitionContext value={hasHydrated ? 'hidden' : false}>{children}</PageTransitionContext>
      </MotionConfig>
    </LazyMotion>
  )
}

export default MotionProvider

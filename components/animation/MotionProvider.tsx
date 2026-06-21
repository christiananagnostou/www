import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { createContext, useContext, useEffect, useState } from 'react'

const PageTransitionContext = createContext<false | 'hidden'>(false)

interface Props {
  children: React.ReactNode
  forcePageTransitionInitial?: boolean
}

export const usePageTransitionInitial = () => useContext(PageTransitionContext)

const MotionProvider = ({ children, forcePageTransitionInitial = false }: Props) => {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => setHasHydrated(true), [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <PageTransitionContext value={forcePageTransitionInitial || hasHydrated ? 'hidden' : false}>
          {children}
        </PageTransitionContext>
      </MotionConfig>
    </LazyMotion>
  )
}

export default MotionProvider

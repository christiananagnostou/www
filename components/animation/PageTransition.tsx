import { AnimatePresence, m as motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={router.asPath}
        exit={prefersReducedMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
        initial={false}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

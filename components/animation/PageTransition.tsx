import { AnimatePresence, m as motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import { useMotionPresets } from './MotionPresetsProvider'

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { pageAnimation } = useMotionPresets()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.asPath}
        animate="show"
        exit="exit"
        initial="hidden"
        style={{ width: '100%' }}
        variants={pageAnimation}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

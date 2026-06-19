import { useReducedMotion } from 'framer-motion'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { motionPresets, reducedMotionPresets, type MotionPresets } from './index'

const MotionPresetsContext = createContext<MotionPresets>(motionPresets)

export function MotionPresetsProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const presets = useMemo(() => (prefersReducedMotion ? reducedMotionPresets : motionPresets), [prefersReducedMotion])

  return <MotionPresetsContext.Provider value={presets}>{children}</MotionPresetsContext.Provider>
}

export function useMotionPresets(): MotionPresets {
  return useContext(MotionPresetsContext)
}

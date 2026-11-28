import type { CSSProperties } from 'react'
import * as m from 'framer-motion/m'
import { animate, type MotionValue, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import Dial from './Dial'

import styles from './Speedometer.module.css'

const READOUT_INTERVAL_MS = 100

const useThrottledMotionValue = (value: MotionValue<number>) => {
  const [displayValue, setDisplayValue] = useState(value.get())
  const pendingValue = useRef(displayValue)
  const lastUpdate = useRef(0)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

  useMotionValueEvent(value, 'change', (latest) => {
    pendingValue.current = latest
    if (timeoutId.current !== null) return

    const remaining = Math.max(0, READOUT_INTERVAL_MS - (performance.now() - lastUpdate.current))
    timeoutId.current = setTimeout(() => {
      lastUpdate.current = performance.now()
      timeoutId.current = null
      setDisplayValue(pendingValue.current)
    }, remaining)
  })

  useEffect(
    () => () => {
      if (timeoutId.current !== null) clearTimeout(timeoutId.current)
    },
    []
  )

  return displayValue
}

interface SpeedometerProps {
  maxSpeed?: number
  diameter?: number
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 220, diameter = 280 }) => {
  // Motion values
  const throttleMv = useMotionValue(0)
  const speedMv = useMotionValue(0)

  const throttle = useThrottledMotionValue(throttleMv)
  const speed = useThrottledMotionValue(speedMv)
  const pedalY = useTransform(throttleMv, [0, 1], [0, 14])
  const pedalRotateX = useTransform(throttleMv, [0, 1], [0, 45])

  const pedalRef = useRef<HTMLButtonElement>(null)
  const pedalBounds = useRef<DOMRect | null>(null)
  const rafId = useRef<number>(0)
  const physicsRunning = useRef(false)

  const startPhysics = useCallback(() => {
    if (physicsRunning.current) return

    physicsRunning.current = true
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      const maxAccel = maxSpeed / 7
      const dragCoef = maxAccel / maxSpeed
      const currentThrottle = throttleMv.get()
      const currentSpeed = speedMv.get()
      const nextSpeed = Math.min(
        Math.max(currentSpeed + (currentThrottle * maxAccel - dragCoef * currentSpeed) * dt, 0),
        maxSpeed
      )

      if (currentThrottle <= 0.001 && nextSpeed <= 0.05) {
        speedMv.set(0)
        physicsRunning.current = false
        rafId.current = 0
        return
      }

      speedMv.set(nextSpeed)
      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)
  }, [maxSpeed, speedMv, throttleMv])

  useMotionValueEvent(throttleMv, 'change', startPhysics)

  const calculateThrottle = (y: number) => {
    if (!pedalRef.current) return 0
    const rect = pedalBounds.current ?? pedalRef.current.getBoundingClientRect()
    const y0 = rect.top
    const y1 = rect.bottom
    if (y1 === y0) return 0
    const normalizedThrottle = (y1 - y) / (y1 - y0)
    return Math.min(Math.max(normalizedThrottle, 0), 1)
  }

  const updateThrottle = (y: number, duration: number) => {
    const targetThrottle = calculateThrottle(y)
    if (duration === 0) {
      throttleMv.set(targetThrottle)
    } else {
      animate(throttleMv, targetThrottle, { type: 'tween', duration, ease: 'easeOut' })
    }
    startPhysics()
  }

  const onThrottleStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    pedalBounds.current = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    updateThrottle(event.clientY, 0.2)
  }

  const onThrottleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    updateThrottle(event.clientY, 0)
  }

  const onThrottleEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bottom = pedalBounds.current?.bottom ?? event.currentTarget.getBoundingClientRect().bottom
    updateThrottle(bottom, 0.2)
    pedalBounds.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      physicsRunning.current = false
    }
  }, [])

  return (
    <div style={{ '--dial-size': `${diameter}px` } as CSSProperties} className={styles.dashboardPanel}>
      <Dial diameter={diameter} maxSpeed={maxSpeed} speed={speedMv} />

      <div className={styles.readout}>
        <span className={styles.speedText}>{Math.round(speed)} mph</span>
        <br />
        <span className={styles.throttleText}>{Math.round(throttle * 100)}% throttle</span>
      </div>

      <div className={styles.throttleBar}>
        <m.div className={styles.throttleFill} style={{ scaleY: throttleMv }} />
      </div>

      <button
        className={styles.pedalBtn}
        ref={pedalRef}
        aria-label="Gas pedal"
        onPointerCancel={onThrottleEnd}
        onPointerDown={onThrottleStart}
        onPointerMove={onThrottleMove}
        onPointerUp={onThrottleEnd}
      >
        <m.div className={styles.pedalFace} style={{ y: pedalY, rotateX: pedalRotateX }} />
      </button>
    </div>
  )
}

export default Speedometer

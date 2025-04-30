import React, { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'framer-motion'
import { DashboardPanel, Readout, SpeedText, ThrottleText, PedalBtn, PedalFace, ThrottleBar } from './styles'
import Dial from './Dial'

interface SpeedometerProps {
  maxSpeed?: number
  diameter?: number
}

const Speedometer: React.FC<SpeedometerProps> = ({ maxSpeed = 220, diameter = 280 }) => {
  // Motion values
  const throttleMv = useMotionValue(0)
  const speedMv = useMotionValue(0)

  // Readout state
  const [throttle, setThrottle] = useState(0)
  const [speed, setSpeed] = useState(0)
  useEffect(() => throttleMv.on('change', setThrottle), [throttleMv])
  useEffect(() => speedMv.on('change', setSpeed), [speedMv])

  const pedalRef = useRef<HTMLButtonElement>(null)

  const calculateThrottle = (y: number) => {
    if (!pedalRef.current) return 0
    const rect = pedalRef.current.getBoundingClientRect()
    const y0 = rect.top
    const y1 = rect.bottom
    if (y1 === y0) return 0
    const throttle = (y1 - y) / (y1 - y0)
    return Math.min(Math.max(throttle, 0), 1)
  }

  const updateThrottle = (y: number, duration: number) => {
    const targetThrottle = calculateThrottle(y)
    animate(throttleMv, targetThrottle, {
      type: 'tween',
      duration,
      ease: 'easeOut',
    })
  }

  const onMove = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) e.preventDefault() // Prevent page scrolling on mobile
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    updateThrottle(y, 0)
  }

  const onEnd = () => {
    updateThrottle(pedalRef.current?.getBoundingClientRect().bottom || 0, 0.2)
    document.body.removeEventListener('mousemove', onMove)
    document.body.removeEventListener('touchmove', onMove)
    document.body.removeEventListener('mouseup', onEnd)
    document.body.removeEventListener('touchend', onEnd)
  }

  const onThrottleStart = (event: React.MouseEvent | React.TouchEvent) => {
    const nativeEvent = event.nativeEvent
    const y = 'touches' in nativeEvent ? nativeEvent.touches[0].clientY : nativeEvent.clientY
    updateThrottle(y, 0.2)

    document.body.addEventListener('mousemove', onMove, { passive: false })
    document.body.addEventListener('touchmove', onMove, { passive: false })
    document.body.addEventListener('mouseup', onEnd, { once: true })
    document.body.addEventListener('touchend', onEnd, { once: true })
  }

  // Physics – acceleration with drag
  const rafId = useRef<number>(0)
  useEffect(() => {
    const maxAccel = maxSpeed / 7 // 0-to-top in ~7 s at WOT
    const dragCoef = maxAccel / maxSpeed

    let last = performance.now()
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now

      const t = throttleMv.get()
      let v = speedMv.get()
      const accel = t * maxAccel - dragCoef * v
      v = Math.min(Math.max(v + accel * dt, 0), maxSpeed)
      speedMv.set(v)

      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)

    return () => {
      rafId.current && cancelAnimationFrame(rafId.current)
    }
  }, [maxSpeed, throttleMv, speedMv])

  return (
    <DashboardPanel $size={diameter}>
      <Dial speed={speed} maxSpeed={maxSpeed} diameter={diameter} />

      <Readout>
        <SpeedText>{Math.round(speed)} mph</SpeedText>
        <br />
        <ThrottleText>{Math.round(throttle * 100)}% throttle</ThrottleText>
      </Readout>

      <ThrottleBar throttle={throttle} />

      <PedalBtn ref={pedalRef} aria-label="Gas pedal" onMouseDown={onThrottleStart} onTouchStart={onThrottleStart}>
        <PedalFace
          animate={{ y: throttle * 14, rotateX: throttle * 45 }}
          transition={{ type: 'tween', duration: 0.05 }}
        />
      </PedalBtn>
    </DashboardPanel>
  )
}

export default Speedometer

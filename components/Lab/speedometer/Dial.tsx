import { animate, useMotionValue } from 'framer-motion'
import React, { useEffect, useMemo } from 'react'
import { DialShell, Label, Marker, Needle, RedlineArc, Tick } from './styles'

interface DialProps {
  speed: number
  maxSpeed: number
  diameter: number
}

const Dial: React.FC<DialProps> = ({ speed, maxSpeed, diameter }) => {
  // Tick sizes
  const TICK_MAJOR = diameter * 0.06
  const TICK_MED = diameter * 0.045
  const TICK_MINOR = diameter * 0.03

  const needleMv = useMotionValue(0) // Initialize to 0

  const startAngle = -135
  const endAngle = 135
  const angleRange = endAngle - startAngle

  // Animate needle
  useEffect(() => {
    const clamped = Math.min(Math.max(speed, 0), maxSpeed)
    const fraction = clamped / maxSpeed
    const targetAngle = startAngle + fraction * angleRange
    animate(needleMv, targetAngle, {
      type: 'spring',
      stiffness: 170,
      damping: 26,
    })
  }, [speed, maxSpeed, needleMv, startAngle, angleRange])

  // Ticks + labels every 10 mph, minor ticks every 1 mph
  const ticks = useMemo(() => {
    const res: Array<{ angle: number; major: boolean; med: boolean; label?: string }> = []
    for (let mph = 0; mph <= maxSpeed; mph += 1) {
      const fraction = mph / maxSpeed
      const angle = startAngle + fraction * angleRange
      const major = mph % 20 === 0
      const med = mph % 10 === 0
      res.push({ angle, major, med, label: major ? String(Math.round(mph)) : undefined })
    }
    return res
  }, [angleRange, maxSpeed, startAngle])

  const radius = diameter / 2
  const tickInner = radius - 4 // Start of tick inside shell
  const labelRadius = radius - 45

  // Redline – from ~80% to 100% of scale
  const redStart = startAngle + 0.8181 * angleRange
  const redEnd = startAngle + 1.0 * angleRange

  return (
    <DialShell $size={diameter}>
      <RedlineArc $end={redEnd} $size={diameter} $start={redStart} />

      {ticks.map(({ angle, major, med, label }, i) => {
        let len = TICK_MINOR
        if (major) len = TICK_MAJOR
        else if (med) len = TICK_MED

        const rotate = `rotate(${angle}deg)`
        return (
          <React.Fragment key={i}>
            <Tick $len={len} $major={major} style={{ transform: `${rotate} translateY(-${tickInner - len}px)` }} />
            {label ? (
              <Label
                style={{
                  transform: `${rotate} translateY(-${labelRadius}px) rotate(${-angle}deg)`,
                }}
              >
                {label}
              </Label>
            ) : null}
          </React.Fragment>
        )
      })}

      {ticks
        .filter((t) => t.major)
        .map(({ angle }, i) => (
          <Marker key={`m${i}`} style={{ transform: `rotate(${angle}deg) translateY(-${radius - 8}px)` }} />
        ))}

      <Needle style={{ rotate: needleMv }} />
    </DialShell>
  )
}

export default Dial

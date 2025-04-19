import { useMotionValue, animate } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { DialShell, Tick, Needle, Label, Marker, RedlineArc } from './styles'

interface DialProps {
  speed: number
  maxSpeed: number
  diameter: number
}

const TICK_MAJOR = 18
const TICK_MED = 14
const TICK_MINOR = 10

const Dial: React.FC<DialProps> = ({ speed, maxSpeed, diameter }) => {
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
  }, [speed, maxSpeed, needleMv])

  // Ticks + labels every 10 mph, minor ticks every 1 mph
  const ticks = useMemo(() => {
    const res: { angle: number; major: boolean; med: boolean; label?: string }[] = []
    for (let mph = 0; mph <= maxSpeed; mph += 1) {
      const fraction = mph / maxSpeed
      const angle = startAngle + fraction * angleRange
      const major = mph % 20 === 0
      const med = mph % 10 === 0
      res.push({ angle, major, med, label: major ? String(Math.round(mph)) : undefined })
    }
    return res
  }, [maxSpeed])

  const radius = diameter / 2
  const tickInner = radius - 4 // Start of tick inside shell
  const labelRadius = radius - 45

  // Redline – from ~80% to 100% of scale
  const redStart = startAngle + 0.82 * angleRange
  const redEnd = startAngle + 1.0 * angleRange

  return (
    <DialShell $size={diameter}>
      <RedlineArc $size={diameter} $start={redStart} $end={redEnd} />

      {ticks.map(({ angle, major, med, label }, i) => {
        const len = major ? TICK_MAJOR : med ? TICK_MED : TICK_MINOR
        const rotate = `rotate(${angle}deg)`
        return (
          <>
            <Tick
              key={`t${i}`}
              $major={major}
              $len={len}
              style={{ transform: `${rotate} translateY(-${tickInner - len}px)` }}
            />
            {label && (
              <Label
                key={`l${i}`}
                style={{
                  transform: `${rotate} translateY(-${labelRadius}px) rotate(${-angle}deg)`,
                }}
              >
                {label}
              </Label>
            )}
          </>
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

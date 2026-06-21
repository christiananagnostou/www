import { type MotionValue, useSpring, useTransform } from 'framer-motion'
import { Fragment, memo, useMemo } from 'react'
import { DialShell, Label, Marker, Needle, RedlineArc, Tick } from './styles'

interface DialProps {
  speed: MotionValue<number>
  maxSpeed: number
  diameter: number
}

const Dial: React.FC<DialProps> = ({ speed, maxSpeed, diameter }) => {
  // Tick sizes
  const TICK_MAJOR = diameter * 0.06
  const TICK_MED = diameter * 0.045
  const TICK_MINOR = diameter * 0.03

  const startAngle = -135
  const endAngle = 135
  const angleRange = endAngle - startAngle
  const needleTarget = useTransform(speed, [0, maxSpeed], [startAngle, endAngle], { clamp: true })
  const needleAngle = useSpring(needleTarget, { stiffness: 170, damping: 26 })

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
  }, [maxSpeed])

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
        const len = major ? TICK_MAJOR : med ? TICK_MED : TICK_MINOR
        const rotate = `rotate(${angle}deg)`
        return (
          <Fragment key={`tick-${i}`}>
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
          </Fragment>
        )
      })}

      {ticks
        .filter((t) => t.major)
        .map(({ angle }, i) => (
          <Marker key={`m${i}`} style={{ transform: `rotate(${angle}deg) translateY(-${radius - 8}px)` }} />
        ))}

      <Needle style={{ rotate: needleAngle }} />
    </DialShell>
  )
}

export default memo(Dial)

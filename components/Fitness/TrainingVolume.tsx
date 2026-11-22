import { memo, useMemo, useState } from 'react'

import { number, SPORT_NAMES, SPORTS, type TrainingLog } from '../../lib/fitness/training'
import styles from './Fitness.module.css'

type Unit = 'hours' | 'miles'
const unitLabel = { hours: 'h', miles: 'mi' }
const W = 680
const H = 144
const round = (n: number) => Number(n.toFixed(2))

function chartGeometry(buckets: TrainingLog['buckets'], unit: Unit) {
  const totals = buckets.map(({ sports }) => SPORTS.reduce((sum, sport) => sum + sports[sport][unit], 0))
  const peak = Math.max(1, ...totals)
  const order = 10 ** Math.floor(Math.log10(peak))
  const ceiling = ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((n) => n * order >= peak) ?? 10) * order
  const step = W / buckets.length
  const width = Math.min(28, step * 0.72)
  const bars = { swim: '', bike: '', run: '', other: '' }
  let average = ''
  buckets.forEach(({ sports }, i) => {
    const center = (i + 0.5) * step
    let y = H
    for (const sport of SPORTS) {
      const height = (H * sports[sport][unit]) / ceiling
      if (!height) continue
      y -= height
      bars[sport] += `M${round(center - width / 2)} ${round(y)}h${round(width)}v${round(height)}h-${round(width)}z`
    }
    if (i >= 3) {
      const mean = (totals[i] + totals[i - 1] + totals[i - 2] + totals[i - 3]) / 4
      average += `${i === 3 ? 'M' : 'L'}${round(center)} ${round(H - (H * mean) / ceiling)}`
    }
  })
  return { totals, ceiling, bars, average }
}

const PlotInk = memo(function PlotInk({ graph }: { graph: ReturnType<typeof chartGeometry> }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={styles.ink}>
      {SPORTS.map((sport) => (
        <path key={sport} fill={`var(--sport-${sport})`} d={graph.bars[sport]} />
      ))}
      <path className={styles.average} d={graph.average} vectorEffect="non-scaling-stroke" />
    </svg>
  )
})

function VolumePlot({ log, unit }: { log: TrainingLog; unit: Unit }) {
  const graph = useMemo(() => chartGeometry(log.buckets, unit), [log.buckets, unit])
  const [index, setIndex] = useState<number | null>(null)
  const last = log.buckets.length - 1
  const selected = index ?? last
  const reading = `${log.buckets[selected].label} · ${number(graph.totals[selected], 1)} ${unitLabel[unit]}`
  return (
    <div className={styles.volumePlot}>
      <div className={styles.scale} aria-hidden="true">
        {[graph.ceiling, graph.ceiling / 2, 0].map((n) => (
          <span key={n}>{number(n, 2)}</span>
        ))}
      </div>
      <div className={styles.plot}>
        <div className={styles.gridLines} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <PlotInk graph={graph} />
        {index !== null && (
          <i
            aria-hidden="true"
            className={styles.cursor}
            style={{ left: `${(100 * (index + 0.5)) / log.buckets.length}%` }}
          />
        )}
        <input
          className={styles.explorer}
          type="range"
          min="0"
          max={last}
          value={selected}
          aria-label={`Explore training by ${log.daily ? 'day' : 'week'}`}
          aria-valuetext={reading}
          onFocus={() => setIndex((current) => current ?? last)}
          onBlur={() => setIndex(null)}
          onChange={(e) => setIndex(e.currentTarget.valueAsNumber)}
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse' || e.buttons !== 0) return
            const bounds = e.currentTarget.getBoundingClientRect()
            setIndex(Math.max(0, Math.min(last, Math.floor(((e.clientX - bounds.left) / bounds.width) * (last + 1)))))
          }}
          onPointerLeave={(e) => {
            if (!e.currentTarget.matches(':focus-visible') && e.pointerType === 'mouse') setIndex(null)
          }}
        />
      </div>
      <div className={styles.ticks} aria-hidden="true">
        {[0, Math.round(last / 3), Math.round((2 * last) / 3), last].map((i) => (
          <span key={i}>{log.buckets[i].tick}</span>
        ))}
      </div>
      <div className={styles.chartNote}>
        <span>{index === null ? (log.daily ? 'Daily totals' : 'Weekly totals') : reading}</span>
        <span className={styles.averageKey}>4-{log.daily ? 'day' : 'week'} average</span>
      </div>
    </div>
  )
}

export default function TrainingVolume({ log }: { log: TrainingLog }) {
  const [unit, setUnit] = useState<Unit>('hours')
  const { hours, miles, sessions, feet } = log.total
  return (
    <section className={styles.volume} aria-labelledby="training-volume">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="training-volume">Training volume</h2>
          <p>{log.dateRange}</p>
        </div>
        <div className={styles.unitSwitch} role="group" aria-label="Chart unit">
          {(['hours', 'miles'] as const).map((u) => (
            <button key={u} type="button" aria-pressed={u === unit} onClick={() => setUnit(u)}>
              {u === 'hours' ? 'Hours' : 'Miles'}
            </button>
          ))}
        </div>
      </div>
      <ul className={styles.legend} aria-label="Chart disciplines">
        {SPORTS.map((sport) => (
          <li key={sport}>
            <i style={{ background: `var(--sport-${sport})` }} />
            {SPORT_NAMES[sport]}
          </li>
        ))}
      </ul>
      <VolumePlot key={log.dateRange} log={log} unit={unit} />
      <dl className={styles.totals}>
        {(
          [
            ['Time', number(hours, 1), 'h'],
            ['Distance', number(miles, 1), 'mi'],
            ['Sessions', number(sessions), ''],
            ['Ascent', number(feet), 'ft'],
          ] as const
        ).map(([label, value, suffix]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              {value} {suffix && <small>{suffix}</small>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

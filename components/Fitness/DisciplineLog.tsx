import { useState, type CSSProperties } from 'react'

import {
  heartRate,
  number,
  pace,
  power,
  SPORT_NAMES,
  SPORTS,
  type Sport,
  type TrainingLog,
} from '../../lib/fitness/training'
import { metersToMiles } from '../../lib/fitness/units'
import styles from './Fitness.module.css'
import SportIllustration from './SportIllustration'

function trendPath(values: Array<number | null>) {
  const peak = Math.max(1, ...values.map((v) => v ?? 0))
  const step = 200 / values.length
  return values
    .map((value, i) => {
      if (value === null || value === 0) return ''
      const height = (24 * value) / peak
      return `M${((i + 0.5) * step).toFixed(2)} 25v-${height.toFixed(2)}`
    })
    .join('')
}

const measured = (value: number | null, suffix = '') => (value === null ? '—' : number(value) + suffix)

function DisciplineDetail({ sport, log }: { sport: Sport; log: TrainingLog }) {
  const [showReadings, setShowReadings] = useState(false)
  const stats = log.sports[sport]
  const data = log.buckets.map(({ sports, label }) => ({ ...sports[sport], label }))
  const rate = heartRate(stats)
  const watts = power(stats)
  const equivalent =
    sport === 'bike'
      ? `${number(stats.miles / 112, 1)} Ironman bike legs`
      : sport === 'swim'
        ? `${number(stats.miles / metersToMiles(50))} lengths of a 50 m pool`
        : sport === 'run'
          ? `${number(stats.feet / 29029, 2)} × Everest`
          : null
  if (!stats.sessions)
    return <p className={styles.noSessions}>No {SPORT_NAMES[sport].toLowerCase()} sessions in this period.</p>
  return (
    <div className={styles.detail}>
      <dl className={styles.trends}>
        {[
          { name: 'Distance', value: `${number(stats.miles, 1)} mi`, points: data.map((d) => d.miles) },
          { name: 'Avg. heart rate', value: measured(rate, ' bpm'), points: data.map(heartRate) },
          { name: 'Avg. power', value: measured(watts, ' W'), points: data.map(power) },
        ].map(({ name, value, points }) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value}</dd>
            <dd aria-hidden="true" className={styles.spark}>
              <svg viewBox="0 0 200 26" preserveAspectRatio="none">
                <path d={trendPath(points)} stroke="currentColor" strokeWidth={Math.min(8, 125 / points.length)} />
              </svg>
            </dd>
          </div>
        ))}
      </dl>
      <dl className={styles.measurements}>
        <div>
          <dt>Avg. speed</dt>
          <dd>{stats.hours ? `${number(stats.miles / stats.hours, 1)} mph` : '—'}</dd>
        </div>
        <div>
          <dt>Avg. pace</dt>
          <dd>{pace(stats.hours, stats.miles)}</dd>
        </div>
        <div>
          <dt>Ascent</dt>
          <dd>{number(stats.feet)} ft</dd>
        </div>
        {equivalent && (
          <div>
            <dt>Equivalent</dt>
            <dd>{equivalent}</dd>
          </div>
        )}
        {sport === 'bike' && (
          <div>
            <dt>Ride time</dt>
            <dd>
              {number(stats.hours - stats.indoorHours, 1)} h road · {number(stats.indoorHours, 1)} h Zwift
            </dd>
          </div>
        )}
      </dl>
      <details className={styles.readings} onToggle={(e) => setShowReadings(e.currentTarget.open)}>
        <summary>{log.daily ? 'Daily' : 'Weekly'} readings</summary>
        {showReadings && (
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${SPORT_NAMES[sport]} readings`}>
            <table aria-label={`${SPORT_NAMES[sport]} training measurements`}>
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col">Miles</th>
                  <th scope="col">BPM</th>
                  <th scope="col">Watts</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((d) => d.sessions)
                  .map((d) => (
                    <tr key={d.label}>
                      <th scope="row">{d.label}</th>
                      <td>{number(d.miles, 1)}</td>
                      <td>{measured(heartRate(d))}</td>
                      <td>{measured(power(d))}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </div>
  )
}

export default function DisciplineLog({ log }: { log: TrainingLog }) {
  const [open, setOpen] = useState<Sport | null>(null)
  return (
    <section className={styles.disciplines} aria-labelledby="disciplines-heading">
      <div className={styles.listHeading}>
        <h2 id="disciplines-heading">By discipline</h2>
        <span>Share of training time</span>
      </div>
      <ul className={styles.sportList}>
        {SPORTS.map((sport) => {
          const stats = log.sports[sport]
          const share = log.total.hours ? (100 * stats.hours) / log.total.hours : 0
          const expanded = sport === open
          return (
            <li key={sport} style={{ '--tone': `var(--sport-${sport})` } as CSSProperties}>
              <h3>
                <button
                  type="button"
                  className={styles.sportRow}
                  aria-expanded={expanded}
                  aria-controls={`detail-${sport}`}
                  onClick={() => setOpen(expanded ? null : sport)}
                >
                  <span className={styles.instrument}>
                    <SportIllustration sport={sport} />
                  </span>
                  <span className={styles.sportTitle}>
                    {SPORT_NAMES[sport]}
                    <small>
                      {number(stats.sessions)} {stats.sessions === 1 ? 'session' : 'sessions'}
                      <span className={styles.mobileDistance}> · {number(stats.miles, 1)} mi</span>
                    </small>
                  </span>
                  <span className={styles.distance}>
                    {number(stats.miles, 1)} <small>mi</small>
                  </span>
                  <span className={styles.share}>
                    <span>
                      {number(stats.hours, 1)} h <small>· {share > 0 && share < 1 ? '<1' : number(share)}%</small>
                    </span>
                    <i aria-hidden="true">
                      <b style={{ width: `${share}%` }} />
                    </i>
                  </span>
                  <svg className={styles.chevron} aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                    <path
                      d="m5 6.5 3 3 3-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h3>
              <div id={`detail-${sport}`} hidden={!expanded}>
                {expanded && <DisciplineDetail sport={sport} log={log} />}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

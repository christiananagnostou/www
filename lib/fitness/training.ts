import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { metersToFeet, metersToMiles } from './units'

dayjs.extend(utc)

export const PERIODS = ['1w', '1m', '3m', '6m', '12m', '24m'] as const
export type Period = (typeof PERIODS)[number]
export const SPORTS = ['swim', 'bike', 'run', 'other'] as const
export type Sport = (typeof SPORTS)[number]
export const SPORT_NAMES: Record<Sport, string> = { swim: 'Swim', bike: 'Bike', run: 'Run', other: 'Other' }

export type TrainingEntry = {
  day: number
  sport: Sport
  seconds: number
  meters: number
  climb: number
  bpm: number | null
  watts: number | null
  indoor: boolean
}

// Number the calendar date, not the instant: Pacific days can be 23 or 25 hours long.
export const dayNumber = (date: dayjs.Dayjs) => Date.UTC(date.year(), date.month(), date.date()) / 86_400_000

const measures = () => ({
  miles: 0,
  hours: 0,
  feet: 0,
  sessions: 0,
  indoorHours: 0,
  beats: 0,
  heartSeconds: 0,
  wattSeconds: 0,
  powerSeconds: 0,
})
const sportMeasures = () => ({ swim: measures(), bike: measures(), run: measures(), other: measures() })
type Measures = ReturnType<typeof measures>

function add(target: Measures, entry: TrainingEntry) {
  const hours = entry.seconds / 3600
  target.hours += hours
  target.miles += metersToMiles(entry.meters)
  target.feet += metersToFeet(entry.climb)
  target.sessions += 1
  if (entry.indoor) target.indoorHours += hours
  if (entry.bpm !== null) {
    target.beats += entry.bpm * entry.seconds
    target.heartSeconds += entry.seconds
  }
  if (entry.watts !== null) {
    target.wattSeconds += entry.watts * entry.seconds
    target.powerSeconds += entry.seconds
  }
}

export const heartRate = (m: Measures) => (m.heartSeconds ? m.beats / m.heartSeconds : null)
export const power = (m: Measures) => (m.powerSeconds ? m.wattSeconds / m.powerSeconds : null)
// ICU uses different range punctuation across Node and browsers. Keep the prerender and hydration identical.
function dateRange(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  if (start.valueOf() === end.valueOf()) return start.format('MMM D, YYYY')
  const sameYear = start.year() === end.year()
  if (sameYear && start.month() === end.month()) return `${start.format('MMM D')}–${end.format('D, YYYY')}`
  return `${start.format(sameYear ? 'MMM D' : 'MMM D, YYYY')} – ${end.format('MMM D, YYYY')}`
}

export function trainingLog(entries: TrainingEntry[], endDay: string, period: Period) {
  const end = dayjs.utc(endDay)
  const start = period === '1w' ? end.subtract(6, 'day') : end.subtract(parseInt(period, 10), 'month')
  const daily = period === '1w' || period === '1m'
  const step = daily ? 1 : 7
  const firstDay = dayNumber(start)
  const lastDay = dayNumber(end)
  const buckets = Array.from({ length: Math.floor((lastDay - firstDay) / step) + 1 }, (_, i) => {
    const first = start.add(i * step, 'day')
    const last = daily ? first : first.add(6, 'day')
    return {
      label: dateRange(first, last.valueOf() > end.valueOf() ? end : last),
      tick: first.format(period === '1w' ? 'ddd' : daily || period === '3m' ? 'MMM D' : 'MMM ’YY'),
      sports: sportMeasures(),
    }
  })
  const sports = sportMeasures()
  const total = measures()
  for (const entry of entries) {
    if (entry.day < firstDay || entry.day > lastDay) continue
    const index = Math.floor((entry.day - firstDay) / step)
    add(buckets[index].sports[entry.sport], entry)
    add(sports[entry.sport], entry)
    add(total, entry)
  }
  return { daily, buckets, sports, total, dateRange: dateRange(start, end) }
}

export type TrainingLog = ReturnType<typeof trainingLog>
const formats = [0, 1, 2].map((maximumFractionDigits) => new Intl.NumberFormat('en-US', { maximumFractionDigits }))
export const number = (value: number, digits: 0 | 1 | 2 = 0) => formats[digits].format(value)
export function pace(hours: number, miles: number) {
  if (!hours || !miles) return '—'
  const seconds = Math.round((hours * 3600) / miles)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} /mi`
}

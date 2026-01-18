import type { Dayjs } from 'dayjs'
import type { DailyEventT } from './DailyCalendar'
import { HOUR_BAR_HEIGHT } from './styles'

/**
 * @param date Dayjs object
 * @param format 12-hour or 24-hour clock format
 */
export const dateToTime = (date: Dayjs, format: 12 | 24 = 24) => {
  const mins = date.minute()
  let hours = date.hour()
  if (format === 12) {
    const suffix = hours >= 12 ? ' PM' : ' AM'
    hours = hours > 12 ? hours - 12 : hours
    hours = hours || 12
    return `${hours}${mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''}${suffix}`
  } else {
    return `${hours}${mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''}`
  }
}

/**
 * @param time formatted as 00:00 on a 24-hour clock. For example: 01:42 or 17:24
 */
export const timeToPx = (time: string) => {
  const [hours, mins] = time.split(':')
  const hoursPx = parseInt(hours) * HOUR_BAR_HEIGHT
  const minsPx = (parseInt(mins || '0') / 60) * HOUR_BAR_HEIGHT
  return hoursPx + minsPx
}

export function getRandomColor(max = 150, min = 50) {
  const random = (): number => {
    const r = Math.floor(Math.random() * 256)
    return r > max || r < min ? random() : r
  }

  return `rgb(${random()},${random()},${random()})`
}

export function formatTime(hours: number) {
  if (hours === 0) return ''

  const suffix = hours >= 12 ? ' PM' : ' AM'
  hours = hours > 12 ? hours - 12 : hours

  return hours + suffix
}

export function addMinutes(date: Dayjs, minutes: number) {
  return date.add(minutes, 'minute')
}

// Computes a layout mapping so that overlapping events are split into columns.
// This implementation first groups events into clusters where events overlap directly,
// then assigns columns within each cluster using a greedy algorithm.
export const computeLayoutStyles = (events: DailyEventT[]) => {
  const sorted = events.toSorted((a, b) => a.start.valueOf() - b.start.valueOf())

  // Group events into clusters (only events that directly overlap belong to the same cluster)
  const clusters: DailyEventT[][] = []
  for (const event of sorted) {
    let added = false
    for (const cluster of clusters) {
      // Check if the event overlaps with at least one event in the cluster
      if (cluster.some((e) => e.start.isBefore(event.end) && e.end.isAfter(event.start))) {
        cluster.push(event)
        added = true
        break
      }
    }
    if (!added) {
      clusters.push([event])
    }
  }

  const layoutMapping: { [id: number]: { col: number; total: number; left: string; width: string } } = {}

  // For each cluster, assign columns using a greedy algorithm.
  clusters.forEach((cluster) => {
    // Sort events in the cluster by start time.
    const clusterSorted = cluster.toSorted((a, b) => a.start.valueOf() - b.start.valueOf())
    const columns: number[] = [] // will hold the latest end time for each column
    for (const event of clusterSorted) {
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        if (columns[i] <= event.start.valueOf()) {
          columns[i] = event.end.valueOf()
          layoutMapping[event.id] = { col: i, total: 0, left: '', width: '' }
          placed = true
          break
        }
      }
      if (!placed) {
        columns.push(event.end.valueOf())
        layoutMapping[event.id] = { col: columns.length - 1, total: 0, left: '', width: '' }
      }
    }
    const total = columns.length
    for (const event of clusterSorted) {
      const { col } = layoutMapping[event.id]
      layoutMapping[event.id].total = total
      layoutMapping[event.id].left = `${(col / total) * 100}%`
      layoutMapping[event.id].width = `${100 / total}%`
    }
  })

  return layoutMapping
}

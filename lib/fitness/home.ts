import type { FitnessActivity } from './activity'
import { metersToFeet, metersToMiles } from './units'

export type HomeActivityCategory = 'swim' | 'cycle' | 'indoorCycle' | 'run'
export type DistanceRank = 1 | 2 | 3

export interface HomeActivity {
  id: string
  category: HomeActivityCategory
  startedAt: string
  distanceRank: DistanceRank | null
  metrics: Array<{ label: string; value: string }>
}

export const HOME_ACTIVITY_LIMIT = 5
export const HOME_ACTIVITY_LABELS = { run: 'Run', cycle: 'Ride', indoorCycle: 'Zwift', swim: 'Swim' } as const
const date = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})
export const formatHomeActivityDate = (startedAt: string) => date.format(new Date(startedAt))

const formatDuration = (seconds: number) => {
  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remaining = total % 60
  const tail = remaining.toString().padStart(2, '0')
  return hours ? `${hours}:${minutes.toString().padStart(2, '0')}:${tail}` : `${minutes}:${tail}`
}

const getCategory = (activity: FitnessActivity): HomeActivityCategory | null => {
  if (activity.kind === 'cycle') return activity.indoor ? 'indoorCycle' : 'cycle'
  if (activity.kind === 'run' || activity.kind === 'swim') return activity.kind
  return null
}

export function getHomeActivityPreview(activities: FitnessActivity[]) {
  const podium: Record<HomeActivityCategory, number[]> = { swim: [], cycle: [], indoorCycle: [], run: [] }
  for (const activity of activities) {
    const category = getCategory(activity)
    if (!category || !Number.isFinite(activity.distanceMeters) || activity.distanceMeters <= 0) continue
    const top = podium[category]
    top.push(activity.distanceMeters)
    top.sort((a, b) => b - a)
    if (top.length > 3) top.pop()
  }

  const totalCounts: Record<HomeActivityCategory, number> = { swim: 0, cycle: 0, indoorCycle: 0, run: 0 }
  const recent: HomeActivity[] = []
  for (const activity of activities) {
    const category = getCategory(activity)
    if (!category) continue
    totalCounts[category] += 1
    if (totalCounts[category] > HOME_ACTIVITY_LIMIT) continue

    const miles = metersToMiles(activity.distanceMeters)
    const elevationFeet = metersToFeet(activity.elevationGainMeters)
    const metrics: HomeActivity['metrics'] = []
    if (activity.durationSeconds > 0) {
      metrics.push({ label: 'Time', value: formatDuration(activity.durationSeconds) })
    }
    if (miles > 0) {
      metrics.push({ label: 'Distance', value: `${miles.toFixed(2)} mi` })
    }
    if (miles > 0 && activity.durationSeconds > 0 && (activity.kind === 'run' || activity.kind === 'swim')) {
      metrics.push({
        label: 'Pace',
        value:
          activity.kind === 'swim'
            ? `${formatDuration((activity.durationSeconds * 100) / activity.distanceMeters)}/100m`
            : `${formatDuration(activity.durationSeconds / miles)}/mi`,
      })
    }
    if (miles > 0 && activity.kind === 'cycle' && activity.durationSeconds > 0) {
      const speed = miles / (activity.durationSeconds / 3600)
      metrics.push({ label: 'Avg Speed', value: `${speed.toFixed(2)} mph` })
    }
    if (elevationFeet > 0) {
      metrics.push({
        label: 'Elevation Gain',
        value: `${elevationFeet.toFixed(2)} ft`,
      })
    }

    const rank = podium[category].indexOf(activity.distanceMeters) + 1
    const distanceRank = rank === 1 || rank === 2 || rank === 3 ? rank : null
    recent.push({ id: activity.id, category, startedAt: activity.startedAt, metrics, distanceRank })
  }
  return { recent, totalCounts }
}

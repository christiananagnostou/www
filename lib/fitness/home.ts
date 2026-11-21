import type { FitnessActivity } from './activity'
import { metersToFeet, metersToMiles } from './units'

export type HomeActivityCategory = 'swim' | 'cycle' | 'indoorCycle' | 'run'

export interface HomeActivity {
  id: string
  category: HomeActivityCategory
  startedAt: string
  metrics: Array<{ label: string; value: string; highlight: boolean }>
}

export const HOME_ACTIVITY_LIMIT = 5

export function getHomeActivityPreview(activities: FitnessActivity[]) {
  const totalCounts: Record<HomeActivityCategory, number> = { swim: 0, cycle: 0, indoorCycle: 0, run: 0 }
  const recent = createHomeActivities(activities).filter(
    ({ category }) => ++totalCounts[category] <= HOME_ACTIVITY_LIMIT
  )
  return { recent, totalCounts }
}

type HomeMetric = HomeActivity['metrics'][number] & { score?: number; lowerIsBetter?: boolean }

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

export const createHomeActivities = (activities: FitnessActivity[]): HomeActivity[] => {
  const homeActivities = activities.flatMap((activity) => {
    const category = getCategory(activity)
    if (!category) return []

    const miles = metersToMiles(activity.distanceMeters)
    const elevationFeet = metersToFeet(activity.elevationGainMeters)
    const metrics: HomeMetric[] = []
    if (activity.durationSeconds > 0) {
      metrics.push({ label: 'Time', value: formatDuration(activity.durationSeconds), highlight: false })
    }
    if (miles > 0) {
      metrics.push({ label: 'Distance', value: `${miles.toFixed(2)} mi`, highlight: false, score: miles })
    }
    if (miles > 0 && activity.durationSeconds > 0 && (activity.kind === 'run' || activity.kind === 'swim')) {
      metrics.push({
        label: 'Pace',
        value:
          activity.kind === 'swim'
            ? `${formatDuration((activity.durationSeconds * 100) / activity.distanceMeters)}/100m`
            : `${formatDuration(activity.durationSeconds / miles)}/mi`,
        highlight: false,
        score: activity.durationSeconds / miles,
        lowerIsBetter: true,
      })
    }
    if (miles > 0 && activity.kind === 'cycle' && activity.durationSeconds > 0) {
      const speed = miles / (activity.durationSeconds / 3600)
      metrics.push({ label: 'Avg Speed', value: `${speed.toFixed(2)} mph`, highlight: false, score: speed })
    }
    if (elevationFeet > 0) {
      metrics.push({
        label: 'Elevation Gain',
        value: `${elevationFeet.toFixed(2)} ft`,
        highlight: false,
        score: elevationFeet,
      })
    }

    return [{ id: activity.id, category, startedAt: activity.startedAt, metrics }]
  })

  const bestScores = new Map<string, number>()
  for (const activity of homeActivities) {
    for (const metric of activity.metrics) {
      if (metric.score === undefined) continue
      const key = `${activity.category}:${metric.label}`
      const bestScore = bestScores.get(key)
      if (bestScore === undefined || (metric.lowerIsBetter ? metric.score < bestScore : metric.score > bestScore)) {
        bestScores.set(key, metric.score)
      }
    }
  }

  return homeActivities.map((activity) => ({
    ...activity,
    metrics: activity.metrics.map(({ score, lowerIsBetter: _, ...metric }) => ({
      ...metric,
      highlight: score === undefined ? false : score === bestScores.get(`${activity.category}:${metric.label}`),
    })),
  }))
}

import type { StravaActivity } from './types'

export interface RawActivityMetrics {
  Distance: number
  ElevationGain: number
  MovingTime: number
  AverageSpeed: number
  Pace: number
}

export const calculateBestValuesByType = (activities: Array<StravaActivity & { raw: RawActivityMetrics }>) => {
  return activities.reduce(
    (acc, activity) => {
      const { type } = activity
      // Initialize the accumulator if it doesn't exist
      if (!acc[type]) {
        acc[type] = {
          Distance: 0, // Higher is better
          ElevationGain: 0, // Higher is better
          MovingTime: Infinity, // Lower is better
          AverageSpeed: 0, // Higher is better
          Pace: Infinity, // Lower is better
        }
      }

      // Update the accumulator with the best values
      acc[type].MovingTime = 0 // No best time
      acc[type].Distance = Math.max(acc[type].Distance, activity.raw.Distance || 0)
      acc[type].Pace = Math.min(acc[type].Pace, activity.raw.Pace || Infinity)
      acc[type].AverageSpeed = Math.max(acc[type].AverageSpeed, activity.raw.AverageSpeed || 0)
      acc[type].ElevationGain = Math.max(acc[type].ElevationGain, activity.raw.ElevationGain || 0)
      return acc
    },
    {} as { [type: string]: RawActivityMetrics }
  )
}

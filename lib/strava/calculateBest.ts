import { StravaActivity } from './types'

export type RawActivityMetrics = {
  Distance: number
  ElevationGain: number
  MovingTime: number
  AverageSpeed: number
  Pace: number
}

export const calculateBestValuesByType = (activities: (StravaActivity & { raw: RawActivityMetrics })[]) => {
  return activities.reduce(
    (acc, activity) => {
      const type = activity.type
      // Initialize the accumulator if it doesn't exist
      if (!acc[type]) {
        acc[type] = {
          Distance: 0,
          ElevationGain: 0,
          MovingTime: Infinity,
          AverageSpeed: 0,
          Pace: Infinity,
        }
      }

      // Update the accumulator with the best values
      acc[type].Distance = Math.max(acc[type].Distance, activity.raw.Distance)
      acc[type].ElevationGain = Math.max(acc[type].ElevationGain, activity.raw.ElevationGain)
      acc[type].MovingTime = Math.min(acc[type].MovingTime, activity.raw.MovingTime)
      acc[type].AverageSpeed = Math.max(acc[type].AverageSpeed, activity.raw.AverageSpeed)
      acc[type].Pace = Math.min(acc[type].Pace, activity.raw.Pace)
      return acc
    },
    {} as { [type: string]: RawActivityMetrics }
  )
}

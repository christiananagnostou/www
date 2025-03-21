import strava from 'strava-v3'
import { StravaActivity } from './types'
import { convertDistance, convertElevation, convertSpeed, formatTime, computePace } from './utils'
import { calculateBestValuesByType } from './calculateBest'

export const getStravaActivities = async (): Promise<StravaActivity[]> => {
  try {
    let allActivities: any[] = []
    let page = 1
    const per_page = 200

    while (true) {
      const activities: any[] = await new Promise((resolve, reject) => {
        strava.athlete.listActivities({ page, per_page }, (err, payload) => {
          if (err) return reject(err)
          resolve(payload)
        })
      })

      if (activities.length === 0) break
      allActivities = allActivities.concat(activities)
      if (activities.length < per_page) break
      page++
    }

    // Map the raw activities to our desired structure
    const mappedActivities = allActivities.map((activity) => {
      const rawDistance = activity.distance // meters
      const rawElevation = activity.total_elevation_gain // meters
      const rawMovingTime = activity.moving_time // seconds
      const rawAverageSpeed = activity.average_speed // m/s
      const computedPaceSeconds = rawDistance > 0 ? rawMovingTime / (rawDistance * 0.000621371) : Infinity
      const maxSpeed = activity.max_speed ? convertSpeed(activity.max_speed) : null
      const mapPolyline = activity.map?.summary_polyline || null

      return {
        title: activity.name,
        link: `https://www.strava.com/activities/${activity.id}`,
        description: activity.description || '',
        pubDate: new Date(activity.start_date).toISOString(),
        guid: activity.id.toString(),
        type: activity.type === 'VirtualRide' ? 'Zwift' : activity.type,
        Distance: convertDistance(rawDistance),
        ElevationGain: convertElevation(rawElevation),
        MovingTime: formatTime(rawMovingTime),
        AverageSpeed: convertSpeed(rawAverageSpeed),
        Pace: computePace(rawMovingTime, rawDistance),
        MaxSpeed: maxSpeed,
        MapPolyline: mapPolyline,
        // Store raw numeric values for best comparisons (for selected metrics)
        raw: {
          Distance: rawDistance,
          ElevationGain: rawElevation,
          MovingTime: rawMovingTime,
          AverageSpeed: rawAverageSpeed,
          Pace: computedPaceSeconds,
        },
        best: { Distance: 0, ElevationGain: 0, MovingTime: 0, AverageSpeed: 0, Pace: 0 },
      }
    })

    const bestValuesByType = calculateBestValuesByType(mappedActivities)

    // Assign best flags based on the raw values
    const finalActivities = mappedActivities.map((activity) => {
      const bestValues = bestValuesByType[activity.type]
      const isBest = {
        Distance: activity.raw.Distance === bestValues.Distance ? 1 : 0,
        ElevationGain: activity.raw.ElevationGain === bestValues.ElevationGain ? 1 : 0,
        MovingTime: activity.raw.MovingTime === bestValues.MovingTime ? 1 : 0,
        AverageSpeed: activity.raw.AverageSpeed === bestValues.AverageSpeed ? 1 : 0,
        Pace: activity.raw.Pace === bestValues.Pace ? 1 : 0,
      }
      const { raw, ...activityWithoutRaw } = activity
      return { ...activityWithoutRaw, best: isBest }
    })

    return finalActivities
  } catch (e) {
    console.error(e)
    return []
  }
}

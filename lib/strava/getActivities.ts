import strava from 'strava-v3'
import { StravaActivity } from './types'
import { convertDistance, convertElevation, convertSpeed, formatTime, computePace, M_TO_MI } from './utils'
import { calculateBestValuesByType } from './calculateBest'

/**
 * Fetches all pages of activities from the Strava API.
 */
const fetchAllActivities = async (per_page = 200): Promise<any[]> => {
  let allActivities: any[] = []
  let page = 1

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

  return allActivities
}

/**
 * Maps a raw Strava activity
 */
const mapActivity = (activity: any): StravaActivity & { raw: any } => {
  const rawDistance: number | null = activity.distance ?? null
  const rawElevation: number | null = activity.total_elevation_gain ?? null
  const rawMovingTime: number | null = activity.moving_time ?? null
  const rawAverageSpeed: number | null = activity.average_speed ?? null

  const computedPaceSeconds: number | null =
    rawDistance != null && rawDistance > 0 && rawMovingTime != null ? rawMovingTime / (rawDistance * M_TO_MI) : null

  const normalizedType: string = activity.type === 'VirtualRide' ? 'Zwift' : activity.type

  const base: any = {
    title: activity.name,
    link: `https://www.strava.com/activities/${activity.id}`,
    description: activity.description || '',
    pubDate: new Date(activity.start_date).toISOString(),
    guid: activity.id.toString(),
    type: normalizedType,
    Distance: rawDistance != null ? convertDistance(rawDistance) : '',
    MovingTime: rawMovingTime != null ? formatTime(rawMovingTime) : '',
    MapPolyline: activity.map?.summary_polyline || '',
    raw: {
      Distance: rawDistance,
      ElevationGain: rawElevation,
      MovingTime: rawMovingTime,
      AverageSpeed: rawAverageSpeed,
      Pace: computedPaceSeconds,
    },
    best: { Distance: 0, ElevationGain: 0, MovingTime: 0, AverageSpeed: 0, Pace: 0 },
  }

  // Conditionally add additional fields based on type
  if (normalizedType === 'Ride' || normalizedType === 'Zwift') {
    base.AverageSpeed = rawAverageSpeed != null ? convertSpeed(rawAverageSpeed) : ''
    base.ElevationGain = rawElevation != null ? convertElevation(rawElevation) : ''
    base.MaxSpeed = activity.max_speed ? convertSpeed(activity.max_speed) : ''
  } else if (normalizedType === 'Run') {
    base.Pace =
      rawMovingTime != null && rawDistance != null && rawDistance > 0 ? computePace(rawMovingTime, rawDistance) : ''
    base.ElevationGain = rawElevation != null ? convertElevation(rawElevation) : ''
  } else if (normalizedType === 'Swim') {
    base.Pace =
      rawMovingTime != null && rawDistance != null && rawDistance > 0 ? computePace(rawMovingTime, rawDistance) : ''
  }

  return base
}

/**
 * Assigns "best" flags for an activity, based on best values by type.
 */
const assignBestFlags = (
  activity: StravaActivity & { raw: any },
  bestValuesByType: { [type: string]: any }
): StravaActivity => {
  const { raw, ...activityWithoutRaw } = activity
  const { Distance, ElevationGain, MovingTime, AverageSpeed, Pace } = raw
  const bestValues = bestValuesByType[activity.type]

  const isBest = {
    Distance: Distance != null && Distance === bestValues.Distance ? 1 : 0,
    ElevationGain: ElevationGain != null && ElevationGain === bestValues.ElevationGain ? 1 : 0,
    MovingTime: MovingTime != null && MovingTime === bestValues.MovingTime ? 1 : 0,
    AverageSpeed: AverageSpeed != null && AverageSpeed === bestValues.AverageSpeed ? 1 : 0,
    Pace: Pace != null && Pace === bestValues.Pace ? 1 : 0,
  }

  return { ...activityWithoutRaw, best: isBest }
}

/**
 * Main function: fetches, maps, and assigns best flags for Strava activities.
 */
export const getStravaActivities = async (): Promise<StravaActivity[]> => {
  try {
    const rawActivities = await fetchAllActivities()
    // const filteredActivities = rawActivities.filter(
    //   (activity) =>
    //     activity.type === 'Run' ||
    //     activity.type === 'Ride' ||
    //     activity.type === 'VirtualRide' ||
    //     activity.type === 'Swim'
    // )
    const mappedActivities = rawActivities.map(mapActivity)
    const bestValuesByType = calculateBestValuesByType(mappedActivities)
    const finalActivities = mappedActivities.map((activity) => assignBestFlags(activity, bestValuesByType))
    return finalActivities
  } catch (e) {
    console.error(e)
    return []
  }
}

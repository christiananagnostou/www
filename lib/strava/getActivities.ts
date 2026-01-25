import strava from 'strava-v3'
import { type RawActivityMetrics, calculateBestValuesByType } from './calculateBest'
import type { StravaActivity, StravaActivityType } from './types'
import { M_TO_MI, computePace, convertDistance, convertElevation, convertSpeed, formatTime } from './utils'

interface RawActivity {
  id: number
  name: string
  description?: string
  start_date: string
  type: string
  distance?: number
  total_elevation_gain?: number
  moving_time?: number
  average_speed?: number
  average_heartrate?: number
  average_watts?: number
  device_watts?: boolean
  has_heartrate?: boolean
  max_speed?: number
  map?: { summary_polyline?: string }
}

/**
 * Fetches all pages of activities from the Strava API.
 */
const fetchAllActivities = async (per_page = 200): Promise<RawActivity[]> => {
  let allActivities: RawActivity[] = []
  let page = 1

  while (true) {
    const activities: RawActivity[] = await strava.athlete.listActivities({ page, per_page })

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
const mapActivity = (activity: RawActivity): StravaActivity & { raw: RawActivityMetrics } => {
  const rawDistance = activity.distance ?? 0
  const rawElevation = activity.total_elevation_gain ?? 0
  const rawMovingTime = activity.moving_time ?? 0
  const rawAverageSpeed = activity.average_speed ?? 0
  const rawAverageHeartRate = activity.has_heartrate === false ? null : (activity.average_heartrate ?? null)
  const rawAverageWatts = activity.device_watts === false ? null : (activity.average_watts ?? null)

  const computedPaceSeconds: number | null =
    rawDistance != null && rawDistance > 0 && rawMovingTime != null ? rawMovingTime / (rawDistance * M_TO_MI) : null

  const normalizedType: StravaActivityType =
    activity.type === 'VirtualRide' ? 'Zwift' : (activity.type as StravaActivityType)

  const base: StravaActivity & { raw: RawActivityMetrics } = {
    title: activity.name,
    link: `https://www.strava.com/activities/${activity.id}`,
    description: activity.description ?? '',
    pubDate: new Date(activity.start_date).toISOString(),
    guid: activity.id.toString(),
    type: normalizedType,
    Distance: rawDistance != null ? convertDistance(rawDistance) : '',
    MovingTime: rawMovingTime != null ? formatTime(rawMovingTime) : '',
    AverageHeartRate: rawAverageHeartRate ?? null,
    AverageWatts: rawAverageWatts ?? null,
    HasHeartRate: activity.has_heartrate ?? false,
    DeviceWatts: activity.device_watts ?? false,
    MapPolyline: activity.map?.summary_polyline ?? '',
    raw: {
      Distance: rawDistance,
      ElevationGain: rawElevation,
      MovingTime: rawMovingTime,
      AverageSpeed: rawAverageSpeed,
      Pace: computedPaceSeconds ?? 0,
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
  activity: StravaActivity & { raw: RawActivityMetrics },
  bestValuesByType: Record<string, RawActivityMetrics>
): StravaActivity => {
  const { raw, ...activityWithoutRaw } = activity
  const { Distance, ElevationGain, MovingTime, AverageSpeed, Pace } = raw
  const bestValues = bestValuesByType[activity.type]

  const isBest = {
    Distance: Distance != null && Distance === bestValues.Distance ? 1 : 0,
    ElevationGain: ElevationGain != null && ElevationGain === bestValues.ElevationGain ? 1 : 0,
    MovingTime: MovingTime != null && MovingTime === bestValues.MovingTime ? 1 : 0,
    AverageSpeed: AverageSpeed != null && AverageSpeed === bestValues.AverageSpeed ? 1 : 0,
    Pace: Pace > 0 && Pace === bestValues.Pace ? 1 : 0,
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

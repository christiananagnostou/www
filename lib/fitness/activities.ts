import { connectRedis, redisClient } from '../../db/redis'
import type { FitnessActivity, StoredFitnessActivity } from './types'

const FITNESS_INDEX_KEY = 'fitness:activities'
const getActivityKey = (id: string) => `fitness:activity:${id}`

const parseMetric = (value?: string) => Number(value?.split(' ')[0]) || 0

const getActivityFingerprint = (activity: StoredFitnessActivity) =>
  [activity.type, activity.pubDate, activity.MovingTime, activity.Distance].join('|')

export const dedupeFitnessActivities = <T extends StoredFitnessActivity>(activities: T[]) => {
  const uniqueActivities = new Map<string, T>()
  for (const activity of activities) {
    const fingerprint = getActivityFingerprint(activity)
    const existing = uniqueActivities.get(fingerprint)
    if (!existing || (!existing.RoutePolylines?.length && activity.RoutePolylines?.length)) {
      uniqueActivities.set(fingerprint, activity)
    }
  }
  return Array.from(uniqueActivities.values())
}

const getStoredActivities = async () => {
  const ids = await redisClient.zRange(FITNESS_INDEX_KEY, 0, -1, { REV: true })
  if (!ids.length) return []

  const values = await redisClient.mGet(ids.map(getActivityKey))
  return values.flatMap((value) => {
    if (!value) return []
    try {
      return [JSON.parse(value) as StoredFitnessActivity]
    } catch {
      return []
    }
  })
}

const getActivityMetrics = (activity: StoredFitnessActivity) => {
  const distance = parseMetric(activity.Distance)
  const durationParts = activity.MovingTime?.split(':').map(Number) ?? []
  const duration = durationParts.length === 3 ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] : 0
  return {
    distance,
    elevation: parseMetric(activity.ElevationGain),
    speed: parseMetric(activity.AverageSpeed),
    pace: distance > 0 && duration > 0 ? duration / distance : 0,
  }
}

const addBestFlags = (activities: StoredFitnessActivity[]): FitnessActivity[] => {
  const bestByType = new Map<string, { distance: number; elevation: number; speed: number; pace: number }>()

  for (const activity of activities) {
    const { distance, elevation, speed, pace } = getActivityMetrics(activity)
    const current = bestByType.get(activity.type) ?? { distance: 0, elevation: 0, speed: 0, pace: Infinity }
    bestByType.set(activity.type, {
      distance: Math.max(current.distance, distance),
      elevation: Math.max(current.elevation, elevation),
      speed: Math.max(current.speed, speed),
      pace: pace > 0 ? Math.min(current.pace, pace) : current.pace,
    })
  }

  return activities.map((activity) => {
    const best = bestByType.get(activity.type)
    const { distance, elevation, speed, pace } = getActivityMetrics(activity)

    return {
      ...activity,
      best: {
        MovingTime: 0,
        Distance: distance > 0 && distance === best?.distance ? 1 : 0,
        ElevationGain: elevation > 0 && elevation === best?.elevation ? 1 : 0,
        AverageSpeed: speed > 0 && speed === best?.speed ? 1 : 0,
        Pace: pace > 0 && pace === best?.pace ? 1 : 0,
      },
    }
  })
}

export const saveFitnessActivities = async (activities: StoredFitnessActivity[]) => {
  if (!(await connectRedis())) throw new Error('Fitness storage is unavailable')
  if (!activities.length) return 0

  const existingActivities = await getStoredActivities()
  const existingByFingerprint = new Map(
    dedupeFitnessActivities(existingActivities).map((activity) => [getActivityFingerprint(activity), activity])
  )
  const existingById = new Map(existingActivities.map((activity) => [activity.guid, activity]))
  const uniqueActivities = dedupeFitnessActivities(
    Array.from(new Map(activities.map((activity) => [activity.guid, activity])).values())
  )
  const changedActivities = uniqueActivities.flatMap((activity) => {
    const fingerprint = getActivityFingerprint(activity)
    const existing = existingByFingerprint.get(fingerprint)
    if (existing && existing.guid !== activity.guid) {
      if (existing.RoutePolylines?.length || !activity.RoutePolylines?.length) return []
      activity = { ...activity, guid: existing.guid }
    }
    existingByFingerprint.set(fingerprint, activity)
    return JSON.stringify(existingById.get(activity.guid)) === JSON.stringify(activity) ? [] : [activity]
  })

  if (!changedActivities.length) return 0
  const transaction = redisClient.multi()
  for (const activity of changedActivities) {
    transaction.set(getActivityKey(activity.guid), JSON.stringify(activity))
    transaction.zAdd(FITNESS_INDEX_KEY, { score: new Date(activity.pubDate).getTime(), value: activity.guid })
  }
  await transaction.exec()
  return changedActivities.length
}

export const getFitnessActivities = async (): Promise<FitnessActivity[]> => {
  if (!(await connectRedis())) throw new Error('Fitness storage is unavailable')

  const activities = await getStoredActivities()
  return addBestFlags(dedupeFitnessActivities(activities))
}

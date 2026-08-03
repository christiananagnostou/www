import { connectRedis, redisClient } from '../../db/redis'
import type { FitnessActivity } from './types'

const FITNESS_INDEX_KEY = 'fitness:activities'
const getActivityKey = (id: string) => `fitness:activity:${id}`

const parseMetric = (value?: string) => Number(value?.split(' ')[0]) || 0

const getActivityFingerprint = (activity: FitnessActivity) =>
  [activity.type, activity.pubDate, activity.MovingTime, activity.Distance].join('|')

export const dedupeFitnessActivities = (activities: FitnessActivity[]) => {
  const fingerprints = new Set<string>()
  return activities.filter((activity) => {
    const fingerprint = getActivityFingerprint(activity)
    if (fingerprints.has(fingerprint)) return false
    fingerprints.add(fingerprint)
    return true
  })
}

const getStoredActivities = async () => {
  const ids = await redisClient.zRange(FITNESS_INDEX_KEY, 0, -1, { REV: true })
  if (!ids.length) return []

  const values = await redisClient.mGet(ids.map(getActivityKey))
  return values.flatMap((value) => {
    if (!value) return []
    try {
      return [JSON.parse(value) as FitnessActivity]
    } catch {
      return []
    }
  })
}

const addBestFlags = (activities: FitnessActivity[]): FitnessActivity[] => {
  const bestByType = new Map<string, { distance: number; elevation: number; speed: number; pace: number }>()

  for (const activity of activities) {
    const distance = parseMetric(activity.Distance)
    const elevation = parseMetric(activity.ElevationGain)
    const speed = parseMetric(activity.AverageSpeed)
    const durationParts = activity.MovingTime?.split(':').map(Number) ?? []
    const duration = durationParts.length === 3 ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] : 0
    const pace = distance > 0 && duration > 0 ? duration / distance : 0
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
    const distance = parseMetric(activity.Distance)
    const elevation = parseMetric(activity.ElevationGain)
    const speed = parseMetric(activity.AverageSpeed)
    const durationParts = activity.MovingTime?.split(':').map(Number) ?? []
    const duration = durationParts.length === 3 ? durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2] : 0
    const pace = distance > 0 && duration > 0 ? duration / distance : 0

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

export const saveFitnessActivities = async (activities: FitnessActivity[]) => {
  if (!(await connectRedis())) throw new Error('Fitness storage is unavailable')
  if (!activities.length) return 0

  const existingActivities = await getStoredActivities()
  const existingByFingerprint = new Map(
    existingActivities.map((activity) => [getActivityFingerprint(activity), activity.guid])
  )
  const uniqueActivities = activities.filter((activity) => {
    const fingerprint = getActivityFingerprint(activity)
    const existingId = existingByFingerprint.get(fingerprint)
    if (existingId && existingId !== activity.guid) return false
    existingByFingerprint.set(fingerprint, activity.guid)
    return true
  })

  const transaction = redisClient.multi()
  for (const activity of uniqueActivities) {
    transaction.set(getActivityKey(activity.guid), JSON.stringify(activity))
    transaction.zAdd(FITNESS_INDEX_KEY, { score: new Date(activity.pubDate).getTime(), value: activity.guid })
  }
  await transaction.exec()
  return uniqueActivities.length
}

export const getFitnessActivities = async (): Promise<FitnessActivity[]> => {
  if (!(await connectRedis())) return []

  const activities = await getStoredActivities()
  return addBestFlags(dedupeFitnessActivities(activities))
}

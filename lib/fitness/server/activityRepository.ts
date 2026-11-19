import { connectRedis, redisClient } from '../../../db/redis'
import { isFitnessActivity, type FitnessActivity } from '../activity'

const ACTIVITY_INDEX_KEY = 'fitness:activity-index'
const getActivityKey = (id: string) => `fitness:activity:${id}`
const SAVE_ACTIVITY_SCRIPT = `
  local existing = redis.call('GET', KEYS[1])
  if existing == ARGV[1] then return 0 end
  redis.call('SET', KEYS[1], ARGV[1])
  redis.call('ZADD', KEYS[2], ARGV[2], ARGV[3])
  return 1
`

const requireConnection = async () => {
  if (!(await connectRedis())) throw new Error('Fitness storage is unavailable')
}

const parseStoredActivity = (value: string) => {
  try {
    const parsed = JSON.parse(value) as unknown
    if (isFitnessActivity(parsed)) return parsed
  } catch {
    // Invalid records are isolated below so one record cannot blank the dashboard.
  }
  console.error('Ignoring an invalid fitness activity in Redis')
  return null
}

const getActivitiesByIds = async (ids: string[]) => {
  if (!ids.length) return []
  const values = await redisClient.mGet(ids.map(getActivityKey))
  return values.flatMap((value) => {
    if (!value) return []
    const activity = parseStoredActivity(value)
    return activity ? [activity] : []
  })
}

export const saveActivities = async (activities: FitnessActivity[]) => {
  await requireConnection()
  if (activities.some((activity) => !isFitnessActivity(activity))) {
    throw new Error('Cannot save invalid fitness activities')
  }

  const uniqueById = Array.from(new Map(activities.map((activity) => [activity.id, activity])).values())
  const transaction = redisClient.multi()
  for (const activity of uniqueById) {
    transaction.eval(SAVE_ACTIVITY_SCRIPT, {
      keys: [getActivityKey(activity.id), ACTIVITY_INDEX_KEY],
      arguments: [JSON.stringify(activity), String(Date.parse(activity.startedAt)), activity.id],
    })
  }
  const results = await transaction.exec()
  return results.filter((result) => Number(result) === 1).length
}

export const getAllActivities = async () => {
  await requireConnection()
  const ids = await redisClient.zRange(ACTIVITY_INDEX_KEY, 0, -1, { REV: true })
  return getActivitiesByIds(ids)
}

export const getActivitiesSince = async (startedAt: Date) => {
  await requireConnection()
  if (Number.isNaN(startedAt.getTime())) throw new Error('Invalid fitness activity start date')

  const ids = await redisClient.zRangeByScore(ACTIVITY_INDEX_KEY, startedAt.getTime(), '+inf')
  const activities = await getActivitiesByIds(ids)
  return activities.toSorted((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
}

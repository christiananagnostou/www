import { isFitnessActivity, type ActivityKind, type FitnessActivity } from '../activity'

export class IntervalsIcuError extends Error {}

interface IntervalsActivity {
  id: string
  startDate: string
  type: string
  movingTime: number
  elapsedTime: number
  distance: number
  elevationGain: number
  indoor: boolean
  averageHeartRate: number | null
  averagePower: number | null
  ignored: boolean
}

interface ActivityRange {
  oldest: string
  newest: string
}

const MAX_ACTIVITIES = 5_000
const ACTIVITY_TYPES: Record<string, ActivityKind> = {
  Ride: 'cycle',
  GravelRide: 'cycle',
  MountainBikeRide: 'cycle',
  EBikeRide: 'cycle',
  EMountainBikeRide: 'cycle',
  VirtualRide: 'cycle',
  Velomobile: 'cycle',
  Run: 'run',
  TrailRun: 'run',
  VirtualRun: 'run',
  Swim: 'swim',
  WeightTraining: 'strength',
  Crossfit: 'strength',
  Hike: 'hike',
  Walk: 'walk',
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseString = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !value || value.length > 256) {
    throw new IntervalsIcuError(`Invalid Intervals.icu ${field}`)
  }
  return value
}

const parseNumber = (value: unknown, field: string, fallback?: number) => {
  if (value == null && fallback !== undefined) return fallback
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000_000) {
    throw new IntervalsIcuError(`Invalid Intervals.icu ${field}`)
  }
  return value
}

const parseNullableNumber = (value: unknown, field: string) => (value == null ? null : parseNumber(value, field))

const parseActivity = (value: unknown): IntervalsActivity => {
  if (!isRecord(value)) throw new IntervalsIcuError('Each Intervals.icu activity must be an object')

  const type = parseString(value.type, 'activity type')
  const movingTime = parseNumber(value.moving_time, 'moving time')
  return {
    id: parseString(value.id, 'activity id'),
    startDate: parseString(value.start_date, 'start date'),
    type,
    movingTime,
    elapsedTime: Math.max(parseNumber(value.elapsed_time, 'elapsed time'), movingTime),
    distance: parseNumber(value.distance, 'distance', 0),
    elevationGain: parseNumber(value.total_elevation_gain, 'elevation gain', 0),
    indoor: value.trainer === true || type === 'VirtualRide' || type === 'VirtualRun',
    averageHeartRate: parseNullableNumber(value.average_heartrate, 'average heart rate'),
    averagePower:
      value.icu_ignore_power === true ? null : parseNullableNumber(value.icu_average_watts, 'average power'),
    ignored: value.icu_ignore_time === true,
  }
}

const toFitnessActivity = (activity: IntervalsActivity): FitnessActivity => {
  const startedAt = new Date(activity.startDate)
  if (Number.isNaN(startedAt.getTime())) {
    throw new IntervalsIcuError(`Invalid Intervals.icu start date: ${activity.startDate}`)
  }

  const fitnessActivity: FitnessActivity = {
    id: `intervals-icu:${activity.id}`,
    startedAt: startedAt.toISOString(),
    endedAt: new Date(startedAt.getTime() + activity.elapsedTime * 1000).toISOString(),
    kind: ACTIVITY_TYPES[activity.type] ?? 'other',
    indoor: activity.indoor,
    durationSeconds: activity.movingTime,
    distanceMeters: activity.distance,
    elevationGainMeters: activity.elevationGain,
    averageHeartRateBpm: activity.averageHeartRate,
    averagePowerWatts: activity.averagePower,
  }
  if (!isFitnessActivity(fitnessActivity)) {
    throw new IntervalsIcuError('Intervals.icu activity metrics exceed supported limits')
  }
  return fitnessActivity
}

export const parseIntervalsIcuActivities = (payload: unknown): FitnessActivity[] => {
  if (!Array.isArray(payload) || payload.length > MAX_ACTIVITIES) {
    throw new IntervalsIcuError(`Expected at most ${MAX_ACTIVITIES} Intervals.icu activities`)
  }
  return payload
    .map(parseActivity)
    .filter((activity) => !activity.ignored)
    .map(toFitnessActivity)
}

export const fetchIntervalsIcuActivities = async ({ oldest, newest }: ActivityRange) => {
  const apiKey = process.env.INTERVALS_ICU_API_KEY
  if (!apiKey) throw new IntervalsIcuError('Intervals.icu is not configured')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(oldest) || !/^\d{4}-\d{2}-\d{2}$/.test(newest)) {
    throw new IntervalsIcuError('Invalid Intervals.icu activity range')
  }

  const url = new URL('https://intervals.icu/api/v1/athlete/0/activities')
  url.searchParams.set('oldest', oldest)
  url.searchParams.set('newest', newest)
  const authorization = Buffer.from(`API_KEY:${apiKey}`).toString('base64')
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${authorization}`,
      'User-Agent': 'christiananagnostou.com fitness sync',
    },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new IntervalsIcuError(`Intervals.icu request failed with status ${response.status}`)
  return parseIntervalsIcuActivities((await response.json()) as unknown)
}

export const ACTIVITY_KINDS = ['swim', 'cycle', 'run', 'strength', 'hike', 'walk', 'other'] as const

export type ActivityKind = (typeof ACTIVITY_KINDS)[number]

export interface FitnessActivity {
  id: string
  startedAt: string
  kind: ActivityKind
  indoor: boolean
  durationSeconds: number
  distanceMeters: number
  elevationGainMeters: number
  averageHeartRateBpm: number | null
  averagePowerWatts: number | null
}

const isNonNegativeNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const isNullableNonNegativeNumber = (value: unknown): value is number | null =>
  value === null || isNonNegativeNumber(value)

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value))

export const isFitnessActivity = (value: unknown): value is FitnessActivity => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  const activity = value as Record<string, unknown>
  return (
    typeof activity.id === 'string' &&
    activity.id.length > 0 &&
    isIsoDate(activity.startedAt) &&
    ACTIVITY_KINDS.includes(activity.kind as ActivityKind) &&
    typeof activity.indoor === 'boolean' &&
    isNonNegativeNumber(activity.durationSeconds) &&
    isNonNegativeNumber(activity.distanceMeters) &&
    isNonNegativeNumber(activity.elevationGainMeters) &&
    isNullableNonNegativeNumber(activity.averageHeartRateBpm) &&
    isNullableNonNegativeNumber(activity.averagePowerWatts)
  )
}

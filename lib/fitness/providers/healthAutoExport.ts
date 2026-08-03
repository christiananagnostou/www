import { isFitnessActivity, type ActivityKind, type FitnessActivity } from '../activity'
import { METERS_PER_FOOT, METERS_PER_KILOMETER, METERS_PER_MILE, METERS_PER_YARD } from '../units'

export class HealthAutoExportPayloadError extends Error {}

interface Quantity {
  qty: number
  units: string
}

interface HealthWorkout {
  id: string
  name: string
  start: string
  end?: string
  duration: number
  isIndoor?: boolean
  distance?: Quantity
  elevationUp?: Quantity
  avgHeartRate?: Quantity
  heartRate?: { avg?: Quantity }
  cyclingPower?: Quantity[]
}

const MAX_WORKOUTS = 2_000
const MAX_POWER_SAMPLES = 20_000
const MAX_STRING_LENGTH = 256
const MAX_QUANTITY = 1_000_000_000
const MAX_DURATION_SECONDS = 31 * 24 * 60 * 60

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseString = (value: unknown, field: string) => {
  if (typeof value !== 'string' || !value || value.length > MAX_STRING_LENGTH) {
    throw new HealthAutoExportPayloadError(`Invalid ${field}`)
  }
  return value
}

const parseQuantity = (value: unknown, field: string): Quantity | undefined => {
  if (value == null) return undefined
  if (
    !isRecord(value) ||
    typeof value.qty !== 'number' ||
    !Number.isFinite(value.qty) ||
    value.qty < 0 ||
    value.qty > MAX_QUANTITY ||
    typeof value.units !== 'string' ||
    value.units.length > 32
  ) {
    throw new HealthAutoExportPayloadError(`Invalid ${field}`)
  }
  return { qty: value.qty, units: value.units }
}

const parseQuantityArray = (value: unknown, field: string): Quantity[] | undefined => {
  if (value == null) return undefined
  if (!Array.isArray(value) || value.length > MAX_POWER_SAMPLES) {
    throw new HealthAutoExportPayloadError(`Invalid ${field}`)
  }
  return value.map((item, index) => parseQuantity(item, `${field}[${index}]`) as Quantity)
}

const parseWorkout = (value: unknown): HealthWorkout => {
  if (!isRecord(value)) throw new HealthAutoExportPayloadError('Each workout must be an object')

  const duration = value.duration
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0 || duration > MAX_DURATION_SECONDS) {
    throw new HealthAutoExportPayloadError('Each workout requires a valid duration')
  }
  if (value.end != null && typeof value.end !== 'string') {
    throw new HealthAutoExportPayloadError('Invalid workout end date')
  }
  if (value.isIndoor != null && typeof value.isIndoor !== 'boolean') {
    throw new HealthAutoExportPayloadError('Invalid isIndoor')
  }
  if (value.heartRate != null && !isRecord(value.heartRate)) {
    throw new HealthAutoExportPayloadError('Invalid heartRate')
  }

  const heartRate = isRecord(value.heartRate) ? { avg: parseQuantity(value.heartRate.avg, 'heartRate.avg') } : undefined
  return {
    id: parseString(value.id, 'workout id'),
    name: parseString(value.name, 'workout name'),
    start: parseString(value.start, 'workout start date'),
    end: typeof value.end === 'string' ? value.end : undefined,
    duration,
    isIndoor: typeof value.isIndoor === 'boolean' ? value.isIndoor : undefined,
    distance: parseQuantity(value.distance, 'distance'),
    elevationUp: parseQuantity(value.elevationUp, 'elevationUp'),
    avgHeartRate: parseQuantity(value.avgHeartRate, 'avgHeartRate'),
    heartRate,
    cyclingPower: parseQuantityArray(value.cyclingPower, 'cyclingPower'),
  }
}

const parseDate = (value: string, field: string) => {
  const healthKitDate = value.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/)
  const normalized = healthKitDate
    ? `${healthKitDate[1]}T${healthKitDate[2]}${healthKitDate[3]}:${healthKitDate[4]}`
    : value
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) throw new HealthAutoExportPayloadError(`Invalid ${field}: ${value}`)
  return date
}

const getActivityKind = (name: string): ActivityKind => {
  const normalizedName = name.toLowerCase()
  if (normalizedName.includes('swim')) return 'swim'
  if (normalizedName.includes('run')) return 'run'
  if (normalizedName.includes('hike')) return 'hike'
  if (normalizedName.includes('walk')) return 'walk'
  if (normalizedName.includes('strength') || normalizedName.includes('weight')) return 'strength'
  if (normalizedName.includes('cycle') || normalizedName.includes('cycling') || normalizedName.includes('bike')) {
    return 'cycle'
  }
  return 'other'
}

const convertQuantity = (quantity: Quantity | undefined, factors: Record<string, number>, field: string) => {
  if (!quantity) return 0
  const factor = factors[quantity.units]
  if (factor == null) throw new HealthAutoExportPayloadError(`Unsupported ${field} unit: ${quantity.units}`)
  return quantity.qty * factor
}

const toMeters = (quantity?: Quantity) =>
  convertQuantity(quantity, { mi: METERS_PER_MILE, km: METERS_PER_KILOMETER, m: 1, yd: METERS_PER_YARD }, 'distance')

const toElevationMeters = (quantity?: Quantity) => convertQuantity(quantity, { ft: METERS_PER_FOOT, m: 1 }, 'elevation')

const getHeartRate = (workout: HealthWorkout) => {
  const heartRate = workout.avgHeartRate ?? workout.heartRate?.avg
  if (!heartRate) return null
  if (!['bpm', 'count/min'].includes(heartRate.units)) {
    throw new HealthAutoExportPayloadError(`Unsupported heart rate unit: ${heartRate.units}`)
  }
  return heartRate.qty
}

const getAveragePower = (values?: Quantity[]) => {
  const watts =
    values?.map((value) => {
      if (value.units !== 'W') {
        throw new HealthAutoExportPayloadError(`Unsupported cycling power unit: ${value.units}`)
      }
      return value.qty
    }) ?? []
  if (!watts.length) return null
  return watts.reduce((sum, value) => sum + value, 0) / watts.length
}

const toActivity = (workout: HealthWorkout): FitnessActivity => {
  const startedAt = parseDate(workout.start, 'workout start date')
  const endedAt = workout.end
    ? parseDate(workout.end, 'workout end date')
    : new Date(startedAt.getTime() + workout.duration * 1000)
  if (endedAt < startedAt) throw new HealthAutoExportPayloadError('Workout end date must follow its start date')

  const normalizedName = workout.name.toLowerCase()
  const activity: FitnessActivity = {
    id: `health-auto-export:${workout.id}`,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    kind: getActivityKind(workout.name),
    indoor: workout.isIndoor ?? (normalizedName.includes('virtual') || normalizedName.includes('zwift')),
    durationSeconds: workout.duration,
    distanceMeters: toMeters(workout.distance),
    elevationGainMeters: toElevationMeters(workout.elevationUp),
    averageHeartRateBpm: getHeartRate(workout),
    averagePowerWatts: getAveragePower(workout.cyclingPower),
  }
  if (!isFitnessActivity(activity)) throw new HealthAutoExportPayloadError('Workout metrics exceed supported limits')
  return activity
}

export const parseHealthAutoExport = (payload: unknown): FitnessActivity[] => {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : undefined
  if (!data || !Array.isArray(data.workouts)) {
    throw new HealthAutoExportPayloadError('Expected a Health Auto Export payload with a data.workouts array')
  }
  if (data.workouts.length > MAX_WORKOUTS) {
    throw new HealthAutoExportPayloadError(`A payload may contain at most ${MAX_WORKOUTS} workouts`)
  }

  return data.workouts.map(parseWorkout).map(toActivity)
}

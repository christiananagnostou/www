import type { FitnessActivityType, StoredFitnessActivity } from './types'

export class FitnessPayloadError extends Error {}

interface Quantity {
  qty: number
  units: string
}

interface HealthWorkout {
  id: string
  name: string
  start: string
  duration: number
  isIndoor?: boolean
  distance?: Quantity
  avgSpeed?: Quantity
  elevationUp?: Quantity
  avgHeartRate?: Quantity
  heartRate?: { avg?: Quantity }
  cyclingPower?: Quantity[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseQuantity = (value: unknown, field: string): Quantity | undefined => {
  if (value == null) return undefined
  if (
    !isRecord(value) ||
    typeof value.qty !== 'number' ||
    !Number.isFinite(value.qty) ||
    value.qty < 0 ||
    typeof value.units !== 'string'
  ) {
    throw new FitnessPayloadError(`Invalid ${field}`)
  }
  return { qty: value.qty, units: value.units }
}

const parseQuantityArray = (value: unknown, field: string): Quantity[] | undefined => {
  if (value == null) return undefined
  if (!Array.isArray(value)) throw new FitnessPayloadError(`Invalid ${field}`)
  return value.map((item, index) => parseQuantity(item, `${field}[${index}]`) as Quantity)
}

const parseWorkout = (value: unknown): HealthWorkout => {
  if (!isRecord(value)) throw new FitnessPayloadError('Each workout must be an object')

  const { id, name, start, duration } = value
  if (typeof id !== 'string' || !id || typeof name !== 'string' || !name || typeof start !== 'string') {
    throw new FitnessPayloadError('Each workout requires an id, name, and start date')
  }
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) {
    throw new FitnessPayloadError('Each workout requires a valid duration')
  }

  if (value.heartRate != null && !isRecord(value.heartRate)) {
    throw new FitnessPayloadError('Invalid heartRate')
  }
  const heartRate = isRecord(value.heartRate) ? { avg: parseQuantity(value.heartRate.avg, 'heartRate.avg') } : undefined
  return {
    id,
    name,
    start,
    duration,
    isIndoor: typeof value.isIndoor === 'boolean' ? value.isIndoor : undefined,
    distance: parseQuantity(value.distance, 'distance'),
    avgSpeed: parseQuantity(value.avgSpeed, 'avgSpeed'),
    elevationUp: parseQuantity(value.elevationUp, 'elevationUp'),
    avgHeartRate: parseQuantity(value.avgHeartRate, 'avgHeartRate'),
    heartRate,
    cyclingPower: parseQuantityArray(value.cyclingPower, 'cyclingPower'),
  }
}

const parseDate = (value: string) => {
  const healthKitDate = value.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/)
  const normalized = healthKitDate
    ? `${healthKitDate[1]}T${healthKitDate[2]}${healthKitDate[3]}:${healthKitDate[4]}`
    : value
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) throw new FitnessPayloadError(`Invalid workout start date: ${value}`)
  return date
}

const getActivityType = (workout: HealthWorkout): FitnessActivityType => {
  const name = workout.name.toLowerCase()
  if (name.includes('swim')) return 'Swim'
  if (name.includes('run')) return 'Run'
  if (name.includes('hike')) return 'Hike'
  if (name.includes('walk')) return 'Walk'
  if (name.includes('strength') || name.includes('weight')) return 'WeightTraining'
  if (name.includes('cycle') || name.includes('cycling') || name.includes('bike')) {
    return workout.isIndoor || name.includes('virtual') || name.includes('zwift') ? 'Zwift' : 'Ride'
  }
  return 'Other'
}

const convertQuantity = (quantity: Quantity | undefined, factors: Record<string, number>, field: string) => {
  if (!quantity) return 0
  const factor = factors[quantity.units]
  if (factor == null) throw new FitnessPayloadError(`Unsupported ${field} unit: ${quantity.units}`)
  return quantity.qty * factor
}

const toMiles = (quantity?: Quantity) =>
  convertQuantity(quantity, { mi: 1, km: 0.621371, m: 0.000621371, yd: 1 / 1760 }, 'distance')

const toFeet = (quantity?: Quantity) => convertQuantity(quantity, { ft: 1, m: 3.28084 }, 'elevation')

const toMph = (quantity?: Quantity) => {
  if (!quantity) return 0
  const factor = { mph: 1, kmph: 0.621371, 'm/s': 2.23694 }[quantity.units]
  return factor == null ? 0 : quantity.qty * factor
}

const formatDuration = (seconds: number) => {
  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const remaining = total % 60
  return [hours, minutes, remaining].map((part) => part.toString().padStart(2, '0')).join(':')
}

const formatPace = (duration: number, miles: number) => {
  if (!miles) return ''
  const secondsPerMile = Math.round(duration / miles)
  const minutes = Math.floor(secondsPerMile / 60)
  const seconds = secondsPerMile % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')} /mi`
}

const getAveragePower = (values?: Quantity[]) => {
  const watts =
    values?.map((value) => {
      if (value.units !== 'W') throw new FitnessPayloadError(`Unsupported cycling power unit: ${value.units}`)
      return value.qty
    }) ?? []
  if (!watts.length) return null
  return Math.round(watts.reduce((sum, value) => sum + value, 0) / watts.length)
}

export const parseHealthAutoExport = (payload: unknown): StoredFitnessActivity[] => {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : undefined
  if (!data || !Array.isArray(data.workouts)) {
    throw new FitnessPayloadError('Expected a Health Auto Export payload with a data.workouts array')
  }

  return data.workouts.map(parseWorkout).map((workout) => {
    const type = getActivityType(workout)
    const miles = toMiles(workout.distance)
    const elevationFeet = toFeet(workout.elevationUp)
    const averageMph = toMph(workout.avgSpeed) || (workout.duration > 0 ? miles / (workout.duration / 3600) : 0)
    const averageHeartRate = workout.avgHeartRate?.qty ?? workout.heartRate?.avg?.qty ?? null
    const averageWatts = getAveragePower(workout.cyclingPower)

    return {
      title: workout.name,
      pubDate: parseDate(workout.start).toISOString(),
      guid: workout.id,
      type,
      Distance: miles > 0 ? `${miles.toFixed(2)} mi` : '',
      ElevationGain: elevationFeet > 0 ? `${elevationFeet.toFixed(2)} ft` : '',
      MovingTime: workout.duration > 0 ? formatDuration(workout.duration) : '',
      AverageSpeed: type === 'Ride' || type === 'Zwift' ? (averageMph > 0 ? `${averageMph.toFixed(2)} mph` : '') : '',
      Pace: type === 'Run' || type === 'Swim' ? formatPace(workout.duration, miles) : '',
      AverageHeartRate: averageHeartRate,
      AverageWatts: averageWatts,
    }
  })
}

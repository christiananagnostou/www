import type { FitnessActivity, FitnessActivityType } from './types'

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
  maxSpeed?: Quantity
  elevationUp?: Quantity
  avgHeartRate?: Quantity
  heartRate?: { avg?: Quantity }
  cyclingPower?: Quantity[]
}

const EMPTY_BEST = { MovingTime: 0, Distance: 0, Pace: 0, AverageSpeed: 0, ElevationGain: 0 }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseQuantity = (value: unknown): Quantity | undefined => {
  if (
    !isRecord(value) ||
    typeof value.qty !== 'number' ||
    !Number.isFinite(value.qty) ||
    typeof value.units !== 'string'
  ) {
    return undefined
  }
  return { qty: value.qty, units: value.units }
}

const parseQuantityArray = (value: unknown): Quantity[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const quantities = value.map(parseQuantity).filter((item): item is Quantity => Boolean(item))
  return quantities.length ? quantities : undefined
}

const parseWorkout = (value: unknown): HealthWorkout => {
  if (!isRecord(value)) throw new Error('Each workout must be an object')

  const { id, name, start, duration } = value
  if (typeof id !== 'string' || !id || typeof name !== 'string' || !name || typeof start !== 'string') {
    throw new Error('Each workout requires an id, name, and start date')
  }
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 0) {
    throw new Error('Each workout requires a valid duration')
  }

  const heartRate = isRecord(value.heartRate) ? { avg: parseQuantity(value.heartRate.avg) } : undefined
  return {
    id,
    name,
    start,
    duration,
    isIndoor: typeof value.isIndoor === 'boolean' ? value.isIndoor : undefined,
    distance: parseQuantity(value.distance),
    avgSpeed: parseQuantity(value.avgSpeed),
    maxSpeed: parseQuantity(value.maxSpeed),
    elevationUp: parseQuantity(value.elevationUp),
    avgHeartRate: parseQuantity(value.avgHeartRate),
    heartRate,
    cyclingPower: parseQuantityArray(value.cyclingPower),
  }
}

const parseDate = (value: string) => {
  const healthKitDate = value.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/)
  const normalized = healthKitDate
    ? `${healthKitDate[1]}T${healthKitDate[2]}${healthKitDate[3]}:${healthKitDate[4]}`
    : value
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid workout start date: ${value}`)
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

const toMiles = (quantity?: Quantity) => {
  if (!quantity) return 0
  if (quantity.units === 'mi') return quantity.qty
  if (quantity.units === 'km') return quantity.qty * 0.621371
  if (quantity.units === 'm') return quantity.qty * 0.000621371
  if (quantity.units === 'yd') return quantity.qty / 1760
  return 0
}

const toFeet = (quantity?: Quantity) => {
  if (!quantity) return 0
  if (quantity.units === 'ft') return quantity.qty
  if (quantity.units === 'm') return quantity.qty * 3.28084
  return 0
}

const toMph = (quantity?: Quantity) => {
  if (!quantity) return 0
  if (quantity.units === 'mph') return quantity.qty
  if (quantity.units === 'kmph') return quantity.qty * 0.621371
  if (quantity.units === 'm/s') return quantity.qty * 2.23694
  return 0
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
  const watts = values?.filter((value) => value.units === 'W').map((value) => value.qty) ?? []
  if (!watts.length) return null
  return Math.round(watts.reduce((sum, value) => sum + value, 0) / watts.length)
}

export const parseHealthAutoExport = (payload: unknown): FitnessActivity[] => {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : undefined
  if (!data || !Array.isArray(data.workouts)) {
    throw new Error('Expected a Health Auto Export payload with a data.workouts array')
  }

  return data.workouts.map(parseWorkout).map((workout) => {
    const type = getActivityType(workout)
    const miles = toMiles(workout.distance)
    const elevationFeet = toFeet(workout.elevationUp)
    const averageMph = toMph(workout.avgSpeed) || (workout.duration > 0 ? miles / (workout.duration / 3600) : 0)
    const maxMph = toMph(workout.maxSpeed)
    const averageHeartRate = workout.avgHeartRate?.qty ?? workout.heartRate?.avg?.qty ?? null
    const averageWatts = getAveragePower(workout.cyclingPower)

    return {
      title: workout.name,
      link: '',
      description: '',
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
      HasHeartRate: averageHeartRate !== null,
      DeviceWatts: averageWatts !== null,
      MaxSpeed: maxMph > 0 ? `${maxMph.toFixed(2)} mph` : '',
      MapPolyline: '',
      best: { ...EMPTY_BEST },
    }
  })
}

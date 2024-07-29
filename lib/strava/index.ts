export type StravaActivity = {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
  type: string
  Distance?: string
  ElevationGain?: string
  MovingTime?: string
  AverageSpeed?: string
  Pace?: string
  best: {
    Distance: number
    ElevationGain: number
    MovingTime: number
    AverageSpeed: number
    Pace: number
  }
}

export const getStravaActivities = async (): Promise<StravaActivity[]> => {
  const res = await fetch('https://feedmyride.net/activities/136520130')
  const data = await res.text()

  const { DOMParser } = await import('xmldom')
  const parser = new DOMParser()
  const xml = parser.parseFromString(data, 'application/xml')
  const items = xml.getElementsByTagName('item')

  const activities = Array.from(items)
    .map((item) => {
      const description = item.getElementsByTagName('description')[0]?.textContent || ''
      const parsedDetails = parseDescription(description)

      return {
        title: item.getElementsByTagName('title')[0]?.textContent || '',
        link: item.getElementsByTagName('link')[0]?.textContent || '',
        description: description,
        pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || '',
        guid: item.getElementsByTagName('guid')[0]?.textContent || '',
        ...parsedDetails,
      }
    })
    .filter(
      (activity) =>
        activity.title && activity.link && activity.description && activity.pubDate && activity.guid && activity.type
    )

  const bestValuesByType = calculateBestValuesByType(activities)

  return activities.map((activity) => {
    const bestValues = bestValuesByType[activity.type]
    const isBest = {
      MovingTime: 0,
      // MovingTime: parseTimeValue(activity.MovingTime || '00:00:00') === bestValues.MovingTime ? 1 : 0,
      Distance: parseValue(activity.Distance || '0') === bestValues.Distance ? 1 : 0,
      ElevationGain: parseValue(activity.ElevationGain || '0') === bestValues.ElevationGain ? 1 : 0,
      AverageSpeed: parseValue(activity.AverageSpeed || '0') === bestValues.AverageSpeed ? 1 : 0,
      Pace: parseTimeValue(activity.Pace || '0:00/km') === bestValues.Pace ? 1 : 0,
    }
    return {
      ...activity,
      best: isBest,
    }
  })
}

const parseDescription = (description: string) => {
  if (!description) return {}

  const [type, metricsString] = description.split(/:(.*)/).map((str) => str.trim())
  if (!type || !metricsString) return {}

  const metricsArray = metricsString
    .split(', ')
    .map((metric) => {
      const [key, value] = metric.split(': ').map((str) => str.trim())
      const keyFormatted = key.replace(/\s+/g, '')
      const valueConverted = convertToUSUnits(keyFormatted, value)

      const isValidValue =
        value &&
        value !== '0' &&
        value !== '0.0km' &&
        value !== '0m' &&
        value !== '00:00:00' &&
        value !== '0.0km/h' &&
        value !== '0:00/km'

      return isValidValue ? { [keyFormatted]: valueConverted } : null
    })
    .filter(Boolean)

  return {
    type,
    ...Object.assign({}, ...metricsArray),
  }
}

const calculateBestValuesByType = (activities: StravaActivity[]) => {
  return activities.reduce((acc, activity) => {
    const type = activity.type

    if (!acc[type]) {
      acc[type] = { Distance: 0, ElevationGain: 0, MovingTime: Infinity, AverageSpeed: 0, Pace: Infinity }
    }

    acc[type].Distance = Math.max(acc[type].Distance, parseValue(activity.Distance || '0'))
    acc[type].ElevationGain = Math.max(acc[type].ElevationGain, parseValue(activity.ElevationGain || '0'))
    acc[type].MovingTime = Math.min(acc[type].MovingTime, parseTimeValue(activity.MovingTime || '00:00:00'))
    acc[type].AverageSpeed = Math.max(acc[type].AverageSpeed, parseValue(activity.AverageSpeed || '0'))
    acc[type].Pace = Math.min(acc[type].Pace, parseTimeValue(activity.Pace || '0:00/km'))

    return acc
  }, {} as { [type: string]: { Distance: number; ElevationGain: number; MovingTime: number; AverageSpeed: number; Pace: number } })
}

const KM_TO_MI = 0.621371
const M_TO_FT = 3.28084

const convertToUSUnits = (key: string, value: string) => {
  const unitConversions: { [key: string]: (val: string) => string } = {
    Distance: (val) => {
      const distanceInKm = parseValue(val)
      const distanceInMiles = distanceInKm * KM_TO_MI
      return `${distanceInMiles.toFixed(2)} mi`
    },
    ElevationGain: (val) => {
      const elevationInMeters = parseValue(val)
      const elevationInFeet = elevationInMeters * M_TO_FT
      return `${elevationInFeet.toFixed(2)} ft`
    },
    AverageSpeed: (val) => {
      const speedInKmH = parseValue(val)
      const speedInMph = speedInKmH * KM_TO_MI
      return `${speedInMph.toFixed(2)} mph`
    },
    Pace: (val) => {
      const totalSecondsPerKm = parseTimeValue(val)
      const totalSecondsPerMile = totalSecondsPerKm / KM_TO_MI
      const minutesPerMile = Math.floor(totalSecondsPerMile / 60)
      const secondsPerMile = Math.round(totalSecondsPerMile % 60)
      return `${minutesPerMile}:${secondsPerMile.toString().padStart(2, '0')} /mi`
    },
  }

  return unitConversions[key] ? unitConversions[key](value) : value
}

const sanitizeValue = (val: string) => {
  return val.replace(/[^\d:.]/g, '')
}

const parseValue = (val: string) => {
  return parseFloat(sanitizeValue(val))
}

const parseTimeValue = (val: string): number => {
  const parts = sanitizeValue(val).split(':').map(Number)
  const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, ...parts]
  return hours * 3600 + minutes * 60 + (Number.isNaN(seconds) ? 0 : seconds)
}

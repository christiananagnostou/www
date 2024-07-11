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
}

export const getStravaActivities = async (): Promise<StravaActivity[]> => {
  const res = await fetch('https://feedmyride.net/activities/136520130')
  const data = await res.text()

  const { DOMParser } = await import('xmldom')
  const parser = new DOMParser()
  const xml = parser.parseFromString(data, 'application/xml')
  const items = xml.getElementsByTagName('item')

  return (
    Array.from(items)
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
      // Validate that activity has all fields
      .filter(
        (activity) =>
          activity.title && activity.link && activity.description && activity.pubDate && activity.guid && activity.type
      )
  )
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

const KM_TO_MI = 0.621371
const M_TO_FT = 3.28084

const parseValue = (val: string) => parseFloat(val.replace(/[^\d:.]/g, ''))

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
      const [minutes, seconds] = val.split(':').map(parseFloat)
      const totalSecondsPerKm = minutes * 60 + seconds
      const totalSecondsPerMile = totalSecondsPerKm / KM_TO_MI
      const minutesPerMile = Math.floor(totalSecondsPerMile / 60)
      const secondsPerMile = Math.round(totalSecondsPerMile % 60)
      return `${minutesPerMile}:${secondsPerMile.toString().padStart(2, '0')} /mi`
    },
  }

  return unitConversions[key] ? unitConversions[key](value) : value
}

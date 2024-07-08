export type StravaActivity = {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
  type?: string
  Distance?: string
  ElevationGain?: string
  MovingTime?: string
  AverageSpeed?: string
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
        value && value !== '0' && value !== '0.0km' && value !== '0m' && value !== '00:00:00' && value !== '0.0km/h'

      return isValidValue ? { [keyFormatted]: valueConverted } : null
    })
    .filter(Boolean)

  return {
    type,
    ...Object.assign({}, ...metricsArray),
  }
}

const convertToUSUnits = (key: string, value: string) => {
  const unitConversions: { [key: string]: (val: string) => string } = {
    Distance: (val) => `${(parseFloat(val) * 0.621371).toFixed(2)} miles`,
    ElevationGain: (val) => `${(parseFloat(val) * 3.28084).toFixed(2)} ft`,
    AverageSpeed: (val) => `${(parseFloat(val) * 0.621371).toFixed(2)} mph`,
  }

  if (unitConversions[key]) {
    return unitConversions[key](value.replace(/[^\d.]/g, ''))
  }
  return value
}

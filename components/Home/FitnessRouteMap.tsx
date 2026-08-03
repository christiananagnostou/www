const decodePolyline = (polyline: string): Array<[number, number]> => {
  let index = 0
  let latitude = 0
  let longitude = 0
  const coordinates: Array<[number, number]> = []

  while (index < polyline.length) {
    let result = 0
    let shift = 0
    let byte: number
    do {
      byte = polyline.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    latitude += result & 1 ? ~(result >> 1) : result >> 1

    result = 0
    shift = 0
    do {
      byte = polyline.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    longitude += result & 1 ? ~(result >> 1) : result >> 1
    coordinates.push([latitude * 1e-5, longitude * 1e-5])
  }

  return coordinates
}

interface Props {
  polylines: string[]
  width?: number
  height?: number
}

export default function FitnessRouteMap({ polylines, width = 100, height = 100 }: Props) {
  const segments = polylines.map(decodePolyline).filter((segment) => segment.length >= 2)
  const points = segments.flat()
  if (!points.length) return null

  const bounds = points.reduce(
    (result, [latitude, longitude]) => ({
      minLatitude: Math.min(result.minLatitude, latitude),
      maxLatitude: Math.max(result.maxLatitude, latitude),
      minLongitude: Math.min(result.minLongitude, longitude),
      maxLongitude: Math.max(result.maxLongitude, longitude),
    }),
    { minLatitude: Infinity, maxLatitude: -Infinity, minLongitude: Infinity, maxLongitude: -Infinity }
  )
  const padding = 4
  const contentWidth = width - padding * 2
  const contentHeight = height - padding * 2
  const routeWidth = Math.max(bounds.maxLongitude - bounds.minLongitude, 1e-6)
  const routeHeight = Math.max(bounds.maxLatitude - bounds.minLatitude, 1e-6)
  const scale = Math.min(contentWidth / routeWidth, contentHeight / routeHeight)
  const offsetX = padding + (contentWidth - routeWidth * scale) / 2
  const offsetY = padding + (contentHeight - routeHeight * scale) / 2
  const toX = (longitude: number) => offsetX + (longitude - bounds.minLongitude) * scale
  const toY = (latitude: number) => height - (offsetY + (latitude - bounds.minLatitude) * scale)

  return (
    <div aria-label="Activity route map with privacy zones removed" role="img">
      <svg height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
        {segments.map((segment, index) => {
          const path = segment
            .map(
              ([latitude, longitude], pointIndex) =>
                `${pointIndex === 0 ? 'M' : 'L'} ${toX(longitude).toFixed(1)} ${toY(latitude).toFixed(1)}`
            )
            .join(' ')
          return <path key={`${index}-${path}`} d={path} fill="none" stroke="var(--accent)" strokeWidth="1" />
        })}
      </svg>
    </div>
  )
}

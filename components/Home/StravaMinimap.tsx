import { styled } from 'styled-components'

// Based on the encoded polyline algorithm from Google Maps
// Decode a polyline string into an array of [lat, lng]
function decodePolyline(str: string): [number, number][] {
  let index = 0,
    lat = 0,
    lng = 0
  const coordinates: [number, number][] = []
  while (index < str.length) {
    let result = 0,
      shift = 0,
      b: number
    do {
      b = str.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1
    lat += deltaLat

    result = 0
    shift = 0
    do {
      b = str.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1
    lng += deltaLng

    coordinates.push([lat * 1e-5, lng * 1e-5])
  }
  return coordinates
}

type MiniMapProps = {
  polyline: string
  width?: number
  height?: number
}

export default function MiniMap({ polyline, width = 100, height = 100 }: MiniMapProps) {
  if (!polyline) return null
  const points = decodePolyline(polyline)
  if (points.length === 0) return null
  // Compute bounding box
  const lats = points.map((p) => p[0])
  const lngs = points.map((p) => p[1])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  // Scale lat/lng to SVG coordinates
  const scaleX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width
  const scaleY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height

  const pathData = points
    .map((p, i) => {
      const x = scaleX(p[1])
      const y = scaleY(p[0])
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div aria-label="Activity route map" role="img">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={pathData} stroke="var(--accent)" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

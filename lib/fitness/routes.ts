export interface RoutePoint {
  latitude: number
  longitude: number
}

export interface PrivacyZone extends RoutePoint {
  radiusMeters: number
}

const EARTH_RADIUS_METERS = 6_371_000
const SIMPLIFICATION_DISTANCE_METERS = 10
const MAX_PRIVACY_PADDING_METERS = 200
const MAX_ROUTE_SEGMENTS = 100
const MAX_ENCODED_ROUTE_LENGTH = 100_000

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

const distanceInMeters = (from: RoutePoint, to: RoutePoint) => {
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(Math.min(1, haversine)))
}

const distanceToSegmentInMeters = (point: RoutePoint, start: RoutePoint, end: RoutePoint) => {
  const latitude = toRadians(point.latitude)
  const project = (coordinate: RoutePoint) => ({
    x: toRadians(coordinate.longitude - point.longitude) * EARTH_RADIUS_METERS * Math.cos(latitude),
    y: toRadians(coordinate.latitude - point.latitude) * EARTH_RADIUS_METERS,
  })
  const projectedStart = project(start)
  const projectedEnd = project(end)
  const segmentX = projectedEnd.x - projectedStart.x
  const segmentY = projectedEnd.y - projectedStart.y
  const lengthSquared = segmentX ** 2 + segmentY ** 2
  if (lengthSquared === 0) return Math.hypot(projectedStart.x, projectedStart.y)
  const position = Math.max(
    0,
    Math.min(1, -(projectedStart.x * segmentX + projectedStart.y * segmentY) / lengthSquared)
  )
  return Math.hypot(projectedStart.x + position * segmentX, projectedStart.y + position * segmentY)
}

const isValidCoordinate = (latitude: number, longitude: number) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  longitude >= -180 &&
  longitude <= 180

export const isValidRoutePoint = (point: RoutePoint) => isValidCoordinate(point.latitude, point.longitude)

export const parsePrivacyZones = (value: string | undefined): PrivacyZone[] => {
  if (!value) return []

  let zones: unknown
  try {
    zones = JSON.parse(value)
  } catch {
    throw new Error('FITNESS_PRIVACY_ZONES must be valid JSON')
  }

  if (!Array.isArray(zones)) throw new Error('FITNESS_PRIVACY_ZONES must be an array')
  return zones.map((zone, index) => {
    if (
      typeof zone !== 'object' ||
      zone === null ||
      !('latitude' in zone) ||
      !('longitude' in zone) ||
      !('radiusMeters' in zone) ||
      typeof zone.latitude !== 'number' ||
      typeof zone.longitude !== 'number' ||
      typeof zone.radiusMeters !== 'number' ||
      !isValidCoordinate(zone.latitude, zone.longitude) ||
      !Number.isFinite(zone.radiusMeters) ||
      zone.radiusMeters <= 0
    ) {
      throw new Error(`Invalid privacy zone at index ${index}`)
    }
    return { latitude: zone.latitude, longitude: zone.longitude, radiusMeters: zone.radiusMeters }
  })
}

const intersectsPrivacyZone = (start: RoutePoint, end: RoutePoint, privacyZones: PrivacyZone[]) =>
  privacyZones.some((zone) => distanceToSegmentInMeters(zone, start, end) <= zone.radiusMeters)

const simplifySegment = (points: RoutePoint[], privacyZones: PrivacyZone[]) => {
  if (points.length <= 2) return points
  const simplified = [points[0]]
  for (let index = 1; index < points.length - 1; index += 1) {
    const lastPoint = simplified.at(-1) as RoutePoint
    if (intersectsPrivacyZone(lastPoint, points[index], privacyZones)) {
      simplified.push(points[index - 1])
    }
    if (distanceInMeters(simplified.at(-1) as RoutePoint, points[index]) >= SIMPLIFICATION_DISTANCE_METERS) {
      simplified.push(points[index])
    }
  }
  const finalPoint = points.at(-1) as RoutePoint
  if (intersectsPrivacyZone(simplified.at(-1) as RoutePoint, finalPoint, privacyZones)) {
    simplified.push(points.at(-2) as RoutePoint)
  }
  simplified.push(finalPoint)
  return simplified
}

const encodeCoordinate = (value: number) => {
  let encoded = ''
  let remaining = value < 0 ? ~(value << 1) : value << 1
  while (remaining >= 0x20) {
    encoded += String.fromCharCode((0x20 | (remaining & 0x1f)) + 63)
    remaining >>= 5
  }
  return encoded + String.fromCharCode(remaining + 63)
}

export const encodePolyline = (points: RoutePoint[]) => {
  let previousLatitude = 0
  let previousLongitude = 0
  return points
    .map((point) => {
      const latitude = Math.round(point.latitude * 1e5)
      const longitude = Math.round(point.longitude * 1e5)
      const encoded = encodeCoordinate(latitude - previousLatitude) + encodeCoordinate(longitude - previousLongitude)
      previousLatitude = latitude
      previousLongitude = longitude
      return encoded
    })
    .join('')
}

const getPrivacyPadding = (routeId: string) => {
  let hash = 0
  for (const character of routeId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  return hash % (MAX_PRIVACY_PADDING_METERS + 1)
}

export const sanitizeRoute = (points: RoutePoint[], privacyZones: PrivacyZone[], routeId = '') => {
  if (!privacyZones.length) throw new Error('Route data requires FITNESS_PRIVACY_ZONES')
  const privacyPadding = getPrivacyPadding(routeId)
  const paddedZones = privacyZones.map((zone) => ({ ...zone, radiusMeters: zone.radiusMeters + privacyPadding }))

  const segments: RoutePoint[][] = []
  let currentSegment: RoutePoint[] = []
  const finishSegment = () => {
    if (currentSegment.length >= 2) segments.push(currentSegment)
    currentSegment = []
  }

  let previousPoint: RoutePoint | undefined
  for (const point of points) {
    const isPrivate = paddedZones.some((zone) => distanceInMeters(point, zone) <= zone.radiusMeters)
    const crossesPrivacyZone = previousPoint && intersectsPrivacyZone(previousPoint, point, paddedZones)
    if (isPrivate || crossesPrivacyZone) {
      finishSegment()
    }
    if (!isPrivate) {
      currentSegment.push(point)
    }
    previousPoint = point
  }
  finishSegment()

  if (segments.length > MAX_ROUTE_SEGMENTS) throw new Error('Route contains too many visible segments')
  const encodedSegments = segments.map((segment) => simplifySegment(segment, paddedZones)).map(encodePolyline)
  if (encodedSegments.reduce((length, segment) => length + segment.length, 0) > MAX_ENCODED_ROUTE_LENGTH) {
    throw new Error('Sanitized route is too large')
  }
  return encodedSegments
}

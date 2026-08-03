import { describe, expect, it } from 'vitest'

import { encodePolyline, parsePrivacyZones, sanitizeRoute } from './routes'

describe('fitness routes', () => {
  it('parses configured privacy zones', () => {
    expect(parsePrivacyZones('[{"latitude":37.4,"longitude":-122.2,"radiusMeters":500}]')).toEqual([
      { latitude: 37.4, longitude: -122.2, radiusMeters: 500 },
    ])
  })

  it('rejects invalid privacy zones', () => {
    expect(() => parsePrivacyZones('[{"latitude":91,"longitude":0,"radiusMeters":500}]')).toThrow(
      'Invalid privacy zone at index 0'
    )
  })

  it('uses the standard encoded polyline format', () => {
    expect(
      encodePolyline([
        { latitude: 38.5, longitude: -120.2 },
        { latitude: 40.7, longitude: -120.95 },
        { latitude: 43.252, longitude: -126.453 },
      ])
    ).toBe('_p~iF~ps|U_ulLnnqC_mqNvxq`@')
  })

  it('removes private points and keeps route segments disconnected', () => {
    const west = [
      { latitude: 0, longitude: -0.01 },
      { latitude: 0, longitude: -0.006 },
    ]
    const east = [
      { latitude: 0, longitude: 0.006 },
      { latitude: 0, longitude: 0.01 },
    ]
    const result = sanitizeRoute(
      [...west, { latitude: 0, longitude: 0 }, ...east],
      [{ latitude: 0, longitude: 0, radiusMeters: 500 }]
    )

    expect(result).toEqual([encodePolyline(west), encodePolyline(east)])
  })

  it('does not store a route contained entirely within a privacy zone', () => {
    expect(
      sanitizeRoute(
        [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.001 },
        ],
        [{ latitude: 0, longitude: 0, radiusMeters: 500 }]
      )
    ).toEqual([])
  })

  it('does not connect outside points across a privacy zone', () => {
    expect(
      sanitizeRoute(
        [
          { latitude: 0, longitude: -0.01 },
          { latitude: 0, longitude: 0.01 },
        ],
        [{ latitude: 0, longitude: 0, radiusMeters: 500 }]
      )
    ).toEqual([])
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { encodePolyline } from '../../lib/fitness'
import FitnessRouteMap from './FitnessRouteMap'

describe('FitnessRouteMap', () => {
  it('renders disconnected route segments in one SVG', () => {
    const polylines = [
      encodePolyline([
        { latitude: 37.4, longitude: -122.2 },
        { latitude: 37.41, longitude: -122.21 },
      ]),
      encodePolyline([
        { latitude: 37.42, longitude: -122.22 },
        { latitude: 37.43, longitude: -122.23 },
      ]),
    ]
    const { container } = render(<FitnessRouteMap polylines={polylines} />)

    expect(screen.getByRole('img', { name: 'Activity route map with privacy zones removed' })).toBeTruthy()
    expect(container.querySelectorAll('path')).toHaveLength(2)
  })
})

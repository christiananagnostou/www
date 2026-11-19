import { expect, it } from 'vitest'
import { formatPhotoDate } from './formatPhotoDate'

it('keeps a photo taken at midnight UTC in its recorded month', () => {
  expect(formatPhotoDate('2024-07-01T00:00:00Z')).toBe("Jul '24")
})

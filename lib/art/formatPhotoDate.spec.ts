import { expect, it } from 'vitest'
import { formatPhotoDate } from './formatPhotoDate'

it.each([
  ['2024-07-01T00:00:00Z', "Jul '24"],
  ['2024-07-01', "Jul '24"],
  ['2024-07-01T00:00:00', "Jul '24"],
  ['2025-01-01T00:30:00+02:00', "Dec '24"],
  ['1999-12-31T23:30:00-02:00', "Jan '00"],
  ['not a date', 'Invalid Date'],
])('formats %s as %s in UTC', (date, expected) => {
  expect(formatPhotoDate(date)).toBe(expected)
})

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import type { TrainingEntry } from '../../lib/fitness/training'
import Fitness from '../../pages/fitness'

vi.mock('../../lib/fitness/server/activityRepository', () => ({ getActivitiesSince: vi.fn() }))
afterEach(cleanup)

const entry: TrainingEntry = {
  day: '2025-06-12',
  sport: 'bike',
  indoor: true,
  seconds: 7200,
  meters: 16093.44,
  climb: 0,
  bpm: null,
  watts: 180,
}

it('keeps empty periods recoverable and rebuilds the chart with the selected period and unit', () => {
  render(<Fitness entries={[entry]} endDay="2025-07-01" />)
  fireEvent.click(screen.getByRole('button', { name: '1 week' }))
  expect(screen.getByRole('status').textContent).toContain('No sessions')
  fireEvent.click(screen.getByRole('button', { name: '1 month' }))
  expect(screen.getByRole('button', { name: '1 month', pressed: true })).toBeTruthy()
  const slider = screen.getByRole('slider', { name: 'Explore training by day' })
  fireEvent.change(slider, { target: { value: '11' } })
  expect(slider.getAttribute('aria-valuetext')).toBe('Jun 12, 2025 · 2 h')
  fireEvent.click(screen.getByRole('button', { name: 'Miles' }))
  expect(slider.getAttribute('aria-valuetext')).toBe('Jun 12, 2025 · 10 mi')
  expect(screen.getByText('4-day average')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: '24 months' }))
  expect(screen.getByText('4-week average')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Miles', pressed: true })).toBeTruthy()
})

it('discloses actual bike readings and the road/Zwift split only on demand', async () => {
  render(<Fitness entries={[entry]} endDay="2025-07-01" />)
  const bike = screen.getByRole('button', { name: /^Bike/, expanded: false })
  expect(screen.queryByText('Ride time')).toBeNull()
  fireEvent.click(bike)
  expect(screen.getByText('0 h road · 2 h Zwift')).toBeTruthy()
  fireEvent.click(screen.getByText('Weekly readings'))
  const table = await screen.findByRole('table', { name: 'Bike training measurements' })
  expect(
    within(table)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)
  ).toEqual(['10', '—', '180'])
  fireEvent.click(screen.getByRole('button', { name: /^Swim/ }))
  expect(screen.getByText('No swim sessions in this period.')).toBeTruthy()
  expect(bike.getAttribute('aria-expanded')).toBe('false')
})

it('does not mistake a storage outage for an empty training period', () => {
  render(<Fitness entries={[]} endDay="2025-07-01" error="Please try again later." />)
  expect(screen.getByRole('status').textContent).toContain('Training log unavailable')
  expect(screen.queryByText('No sessions in this period')).toBeNull()
})

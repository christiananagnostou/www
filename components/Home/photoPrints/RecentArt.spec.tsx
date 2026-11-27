import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { ArtImages } from '../../../lib/art'
import RecentArt from '../RecentArt'

const source = (img: HTMLImageElement) => new URL(img.src).searchParams.get('url') ?? img.getAttribute('src')

function openTile(reduceMotion = false) {
  vi.useFakeTimers()
  const preference = Object.assign(new EventTarget(), { matches: reduceMotion })
  vi.stubGlobal('matchMedia', () => preference)
  let notify: (entries: { intersectionRatio: number }[]) => void
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: typeof notify) {
        notify = callback
      }
      observe() {}
      disconnect() {}
    }
  )
  const { container } = render(<RecentArt />)
  return {
    images: () => [...container.querySelectorAll('img')],
    inView: (value: boolean) => act(() => notify([{ intersectionRatio: value ? 1 : 0 }])),
    wait: (ms = 30_000) => act(() => vi.advanceTimersByTime(ms)),
  }
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it('holds each selected print for ten seconds before loading and revealing the next one', async () => {
  const tile = openTile()
  const rotation = ['bnw_baseball', 'adobe_bnw', 'stair_shadow', 'satellite'].map((id) => {
    const { image } = ArtImages.find((photo) => photo.id === id)!
    return typeof image === 'string' ? image : image.src
  })
  const [first, ...rest] = rotation
  expect(source(tile.images()[0])).toBe(first)
  tile.inView(true)
  for (const expected of [...rest, first]) {
    const [previous] = tile.images()
    tile.wait(9_999)
    expect(tile.images()).toEqual([previous])
    tile.wait(1)
    const incoming = tile.images().find((img) => img !== previous)!
    const sheet = incoming.closest<HTMLElement>('[data-stage]')!
    expect(sheet.dataset.stage).toBe('loading')
    expect(source(incoming)).toBe(expected)
    await act(async () => fireEvent.load(incoming))
    expect(sheet.dataset.stage).toBe('printing')
    // JSDOM doesn't implement AnimationEvent; React listens for its prefixed event there.
    fireEvent(sheet, new Event('AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd', { bubbles: true }))
    expect(tile.images()).toEqual([incoming])
  }
})

it('does not request another photo offscreen, while paused, or after a failed next image', () => {
  const tile = openTile()
  const first = tile.images()[0]
  tile.wait()
  expect(tile.images()).toEqual([first])
  tile.inView(true)
  fireEvent.click(screen.getByRole('button', { name: 'Pause photo rotation' }))
  tile.wait()
  expect(tile.images()).toEqual([first])
  fireEvent.click(screen.getByRole('button', { name: 'Resume photo rotation' }))
  tile.wait()
  fireEvent.error(tile.images()[1])
  tile.wait()
  expect(tile.images()).toEqual([first])
  expect(screen.getByRole('link', { name: 'Photos' }).getAttribute('href')).toBe('/art')
})

it('offers a still print and a working gallery link when reduced motion is requested', () => {
  const tile = openTile(true)
  tile.inView(true)
  tile.wait()
  expect(tile.images()).toHaveLength(1)
  expect(screen.queryByRole('button')).toBeNull()
  expect(screen.getByRole('link', { name: 'Photos' }).getAttribute('href')).toBe('/art')
})

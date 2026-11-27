// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FullscreenModal from '../components/Art/FullScreenModal'
import type { ArtImage } from '../lib/art'

const photos: ArtImage[] = ['Pier', 'Tower', 'Beach', 'Bridge'].map((title) => ({
  id: title,
  title,
  tags: [],
  date: '2025-01-01',
  image: { src: `/${title}.jpg`, width: 800, height: 600 },
}))

function openViewer(images = photos, initialIndex = 0) {
  const close = vi.fn()
  render(
    <div
      ref={(node) => {
        // JSDOM does not implement the native dialog methods.
        const dialog = node?.querySelector('dialog')
        if (dialog) {
          dialog.showModal = () => {
            dialog.open = true
          }
          dialog.close = () => {
            dialog.open = false
          }
        }
      }}
    >
      <FullscreenModal images={images} initialIndex={initialIndex} onClose={close} />
    </div>
  )
  const dialog = screen.getByRole('dialog')
  return {
    frames: () => [...dialog.querySelectorAll('img')],
    visible: () => screen.getByRole('img') as HTMLImageElement,
    standby: () => dialog.querySelector<HTMLImageElement>('[aria-hidden="true"] img')!,
    next: () => fireEvent.click(screen.getByRole('button', { name: 'Next image' })),
    previous: () => fireEvent.keyDown(dialog, { key: 'ArrowLeft' }),
    close,
  }
}

const load = (image: HTMLImageElement) =>
  act(async () => {
    fireEvent.load(image)
  })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('full screen photography viewer', () => {
  it('warms exactly one responsive neighbor after the open photo loads, then presents that same element', async () => {
    const viewer = openViewer()
    const first = viewer.visible()
    expect(viewer.frames()).toEqual([first])
    await load(first)
    const next = viewer.standby()
    expect(next.getAttribute('loading')).toBe('eager')
    expect(next.getAttribute('fetchpriority')).toBe('low')
    expect(next.sizes).toBe(first.sizes)
    expect(next.srcset).toContain('/_next/image')
    await load(next)
    expect(viewer.frames()).toEqual([first, next])
    expect(viewer.visible()).toBe(first)

    viewer.next()
    expect(viewer.visible()).toBe(next)
    expect(screen.getByRole('status').textContent).toContain('2 of 4')
    expect(viewer.frames()).toHaveLength(3)
    viewer.previous()
    expect(viewer.visible()).toBe(first)
  })

  it('keeps the photo and caption together through a slow decode and ignores a skipped photo', async () => {
    const viewer = openViewer()
    const first = viewer.visible()
    await load(first)
    const skipped = viewer.standby()
    viewer.next()
    expect(viewer.visible()).toBe(first)
    expect(screen.getByRole('status').textContent).toContain('1 of 4')
    viewer.next()
    const target = viewer.standby()
    let release!: () => void
    target.decode = () =>
      new Promise<void>((resolve) => {
        release = resolve
      })
    await load(target)
    await load(skipped)
    expect(viewer.visible()).toBe(first)
    await act(async () => release())
    expect(viewer.visible()).toBe(target)
    expect(target.alt).toBe('Beach')
    expect(screen.getByRole('status').textContent).toContain('3 of 4')
  })

  it('wraps within a filtered set without duplicates and keeps the close control', async () => {
    const viewer = openViewer(photos.slice(2), 1)
    await load(viewer.visible())
    const pair = viewer.frames()
    const first = viewer.standby()
    await load(first)
    viewer.next()
    expect(viewer.visible().alt).toBe('Beach')
    expect(viewer.frames()).toEqual(pair)
    viewer.previous()
    expect(viewer.visible().alt).toBe('Bridge')
    expect(viewer.frames()).toEqual(pair)
    fireEvent.click(screen.getByRole('button', { name: 'Close full screen view' }))
    expect(viewer.close).toHaveBeenCalledOnce()
  })

  it('uses the direction of the input across wraparound, but skips motion for a held arrow', async () => {
    const viewer = openViewer(photos.slice(0, 2), 1)
    const dialog = screen.getByRole('dialog')
    await load(viewer.visible())
    await load(viewer.standby())
    const stage = dialog.querySelector('[aria-busy]')!
    expect(stage.hasAttribute('data-direction')).toBe(false)

    viewer.next()
    expect(viewer.visible().alt).toBe('Pier')
    expect(stage.getAttribute('data-direction')).toBe('next')
    viewer.previous()
    expect(viewer.visible().alt).toBe('Tower')
    expect(stage.getAttribute('data-direction')).toBe('previous')
    fireEvent.keyDown(dialog, { key: 'ArrowLeft', repeat: true })
    expect(viewer.visible().alt).toBe('Pier')
    expect(stage.hasAttribute('data-direction')).toBe(false)
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(viewer.visible().alt).toBe('Tower')
    expect(stage.getAttribute('data-direction')).toBe('next')
  })

  it('only fetches on demand with Data Saver and does not warm another photo after the switch', async () => {
    vi.stubGlobal('navigator', Object.create(navigator, { connection: { value: { saveData: true } } }))
    const viewer = openViewer()
    const first = viewer.visible()
    await load(first)
    expect(viewer.frames()).toEqual([first])
    viewer.next()
    const next = viewer.standby()
    expect(next.getAttribute('fetchpriority')).toBe('high')
    await load(next)
    expect(viewer.visible()).toBe(next)
    expect(viewer.frames()).toEqual([first, next])
  })

  it('does not expose a failed standby photo and lets the user retry when they reach it', async () => {
    const viewer = openViewer()
    await load(viewer.visible())
    fireEvent.error(viewer.standby())
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
    viewer.next()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    const retried = viewer.visible()
    await load(retried)
    expect(retried.alt).toBe('Tower')
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
  })

  it('never preloads or navigates in a single-photo viewer', async () => {
    const viewer = openViewer(photos.slice(0, 1))
    await load(viewer.visible())
    expect(viewer.frames()).toHaveLength(1)
    expect((screen.getByRole('button', { name: 'Next image' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Previous image' }) as HTMLButtonElement).disabled).toBe(true)
  })
})

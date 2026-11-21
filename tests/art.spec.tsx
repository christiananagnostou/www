import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import FullscreenModal from '../components/Art/FullScreenModal'
import PhotoGrid from '../components/Art/PhotoGrid'
import type { ArtImage } from '../lib/art'
import { photoTags, photosForTag } from '../lib/art/gallery'
import { getStaticPaths, getStaticProps } from '../pages/art/[[...category]]'

const photos: ArtImage[] = ['Pier', 'Tower', 'Bridge', 'Beach'].map((title) => ({
  id: title,
  title,
  tags: ['Coast'],
  date: '2025-01-01',
  image: { src: `/${title}.jpg`, width: 800, height: 600, blurDataURL: 'data:image/jpeg;base64,AA==' },
}))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('photography gallery', () => {
  it('prebuilds All and every shareable category, including B&W', async () => {
    const result = await getStaticPaths({})
    expect(result.fallback).toBe(false)
    expect(result.paths).toEqual([[], ...photoTags.map((tag) => [tag])].map((category) => ({ params: { category } })))
    expect(await getStaticProps({ params: { category: ['B&W'] } })).toEqual({ props: { initialTag: 'B&W' } })
    expect(await getStaticProps({ params: { category: [] } })).toEqual({ props: { initialTag: null } })
    const cars = photosForTag('Cars')
    expect(cars.length).toBeGreaterThan(0)
    expect(cars).toEqual(photosForTag(null).filter((photo) => photo.tags.includes('Cars')))
  })

  it('reserves offscreen tiles but only mounts their thumbnails when they approach the viewport', () => {
    let notify: (entries: Pick<IntersectionObserverEntry, 'target' | 'isIntersecting'>[]) => void
    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof notify) {
          notify = callback
        }
        observe = observe
        unobserve = unobserve
        disconnect = disconnect
      }
    )
    const open = vi.fn()
    const view = render(<PhotoGrid photos={photos} tag={null} onOpen={open} onSelectTag={vi.fn()} />)
    const bridge = screen.getByRole('button', { name: 'Open full screen image: Bridge' })
    expect(screen.getAllByRole('img').map((el) => el.getAttribute('alt'))).toEqual(['Pier', 'Tower'])
    expect(bridge.style.aspectRatio).toBe('800 / 600')
    expect(observe).toHaveBeenCalledWith(bridge)
    const intersect = (isIntersecting: boolean) => act(() => notify([{ target: bridge, isIntersecting }]))
    intersect(false)
    expect(within(bridge).queryByRole('img')).toBeNull()
    intersect(true)
    expect(within(bridge).getByRole('img').getAttribute('srcset')).toBeTruthy()
    expect(unobserve).toHaveBeenCalledWith(bridge)
    fireEvent.click(bridge)
    expect(open).toHaveBeenCalledWith(photos[2])
    view.unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('still exposes every photo without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<PhotoGrid photos={photos} tag={null} onOpen={vi.fn()} onSelectTag={vi.fn()} />)
    expect(screen.getAllByRole('img')).toHaveLength(photos.length)
  })

  it('mounts a responsive viewer image immediately and wraps in both directions within the filtered set', () => {
    const close = vi.fn()
    render(
      <div
        ref={(node) => {
          // JSDOM does not implement the native dialog methods.
          const dialog = node?.querySelector('dialog')
          if (!dialog) return
          dialog.showModal = () => {
            dialog.open = true
          }
          dialog.close = () => {
            dialog.open = false
          }
        }}
      >
        <FullscreenModal images={photos} initialIndex={3} onClose={close} />
      </div>
    )
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next image' }))
    const next = within(dialog).getByAltText(/^Pier - /) as HTMLImageElement
    expect(next.getAttribute('loading')).toBe('eager')
    expect(next.getAttribute('sizes')).toContain('800px')
    expect(next.srcset).toContain('/_next/image')
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(within(dialog).getByAltText(/^Beach - /)).toBeTruthy()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close full screen view' }))
    expect(close).toHaveBeenCalledOnce()
  })
})

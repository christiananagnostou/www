// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PhotoFilters from '../components/Art/PhotoFilters'
import PhotoGrid from '../components/Art/PhotoGrid'
import type { ArtImage } from '../lib/art'
import { photosForTag } from '../lib/art/gallery'
import { getStaticPaths, getStaticProps } from '../pages/art/[[...category]]'

const photos: ArtImage[] = ['Pier', 'Tower', 'Bridge', 'Beach'].map((title) => ({
  id: title,
  title,
  tags: ['SF'],
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
    const tags = new Set(photosForTag(null).flatMap((photo) => photo.tags))
    expect(result.fallback).toBe(false)
    expect(result.paths).toHaveLength(tags.size + 1)
    expect(result.paths).toContainEqual({ params: { category: [] } })
    for (const tag of tags) expect(result.paths).toContainEqual({ params: { category: [tag] } })
    expect(await getStaticProps({ params: { category: ['B&W'] } })).toEqual({ props: { initialTag: 'B&W' } })
    expect(await getStaticProps({ params: { category: [] } })).toEqual({ props: { initialTag: null } })
    const cars = photosForTag('Cars')
    expect(cars.length).toBeGreaterThan(0)
    expect(cars).toEqual(photosForTag(null).filter((photo) => photo.tags.includes('Cars')))
  })

  it('selects and clears the same category from the filter row and from a photo', () => {
    const activeButtonRef = createRef<HTMLButtonElement>()
    const select = vi.fn()
    const gallery = (tag: string | null) => (
      <>
        <PhotoFilters activeTag={tag} activeButtonRef={activeButtonRef} onSelect={select} />
        <PhotoGrid photos={[photos[0]]} tag={tag} onSelectTag={select} onOpen={vi.fn()} />
      </>
    )
    const view = render(gallery(null))
    const row = within(screen.getByRole('group', { name: 'Filter photographs' }))
    const grid = within(screen.getByRole('region', { name: 'Photographs' }))
    expect(activeButtonRef.current).toBe(row.getByRole('button', { name: 'All', pressed: true }))
    fireEvent.click(grid.getByRole('button', { name: 'SF', pressed: false }))
    expect(select).toHaveBeenLastCalledWith('SF')

    view.rerender(gallery('SF'))
    const selected = row.getByRole('button', { name: 'SF', pressed: true })
    expect(activeButtonRef.current).toBe(selected)
    fireEvent.click(selected)
    fireEvent.click(grid.getByRole('button', { name: 'SF', pressed: true }))
    expect(select.mock.calls).toEqual([['SF'], [null], [null]])
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
    expect(within(bridge).getByRole('img').getAttribute('loading')).toBe('eager')
    expect(unobserve).toHaveBeenCalledWith(bridge)
    fireEvent.click(bridge)
    expect(open).toHaveBeenCalledWith(photos[2])
    view.unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('still exposes every photo without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<PhotoGrid photos={photos} tag={null} onOpen={vi.fn()} onSelectTag={vi.fn()} />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(photos.length)
    expect(images.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true)
  })
})

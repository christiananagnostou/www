import { fireEvent, render } from '@testing-library/react'
import { Profiler } from 'react'
import { expect, it, vi } from 'vitest'

import DragScrollContainer from './index'

it('scrolls every drag step without rendering for each pointer position', () => {
  const onRender = vi.fn()
  const onClick = vi.fn()
  const onEndScroll = vi.fn()
  const { container } = render(
    <Profiler id="timeline" onRender={onRender}>
      <DragScrollContainer onClick={onClick} onEndScroll={onEndScroll} />
    </Profiler>
  )
  const panel = container.firstElementChild as HTMLElement
  Object.defineProperty(panel, 'scrollWidth', { value: 600 })
  panel.scrollLeft = 100

  fireEvent.mouseDown(panel, { clientX: 60 })
  fireEvent.mouseMove(document, { clientX: 50 })
  fireEvent.mouseUp(document)
  expect(onClick).toHaveBeenCalledOnce()
  expect(panel.scrollLeft).toBe(100)

  fireEvent.mouseDown(panel, { clientX: 60 })
  fireEvent.mouseMove(document, { clientX: 49 })
  expect(document.body.classList.contains('body-dragging')).toBe(true)
  onRender.mockClear()
  for (const x of [46, 40, 43]) {
    fireEvent.mouseMove(document, { clientX: x })
    expect(panel.scrollLeft).toBe(100 + 49 - x)
  }
  expect(onRender).not.toHaveBeenCalled()
  fireEvent.mouseUp(document)
  expect(onEndScroll).toHaveBeenCalledExactlyOnceWith({ external: false })
  expect(onClick).toHaveBeenCalledOnce()
  expect(document.body.classList.contains('body-dragging')).toBe(false)
})

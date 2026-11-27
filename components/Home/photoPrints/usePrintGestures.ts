import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
  type TouchEvent,
  type WheelEvent,
} from 'react'

import { printPosition } from './printPosition'

const DEAD_ZONE = 10
const FULL_PULL = 168
// A wheel does not have a portable finger-up event.
const WHEEL_IDLE = 220

type Drag = { id: number | null; x: number; y: number; left: number; end: number; fullPull: number }

export function usePrintGestures(rail: RefObject<HTMLDivElement | null>, count: number) {
  const gallery = useRef<HTMLAnchorElement>(null)
  const indicator = useRef<SVGSVGElement>(null)
  const drag = useRef<Drag | null>(null)
  const dragged = useRef(false)
  const travel = useRef(0)
  const wheel = useRef({ last: -Infinity, timer: 0, distance: 0, previousDelta: 0, falling: 0 })

  const draw = useCallback((distance: number, fullPull = FULL_PULL) => {
    const raw = (distance - DEAD_ZONE) / (fullPull - DEAD_ZONE)
    // A few pixels of hand tremor shouldn't toggle the filled ring on and off.
    const minimum = travel.current >= 1 && distance >= fullPull - 4 ? 1 : 0
    const value = Math.min(2, Math.max(minimum, raw))
    if (value === travel.current) return
    travel.current = value
    const icon = indicator.current
    if (!icon) return
    icon.style.setProperty('--travel', String(value))
    if (value) icon.dataset.pull = value >= 1 ? 'ready' : 'tracking'
    else delete icon.dataset.pull
  }, [])

  const cancel = useCallback(() => {
    drag.current = null
    window.clearTimeout(wheel.current.timer)
    wheel.current.timer = 0
    wheel.current.distance = 0
    draw(0)
    const node = rail.current
    if (node?.hasAttribute('data-dragging')) {
      node.removeAttribute('data-dragging')
      // Give CSS the final offset even if this drag interrupted an earlier Firefox snap.
      node.scrollTo({ left: node.scrollLeft })
    }
  }, [draw, rail])

  useEffect(() => {
    window.addEventListener('blur', cancel)
    return () => {
      window.removeEventListener('blur', cancel)
      cancel()
    }
  }, [cancel])

  function lastPrintIsNearest(node: HTMLDivElement) {
    return printPosition(node, count) > count - 1.5
  }

  function release() {
    const open = travel.current >= 1 && rail.current && lastPrintIsNearest(rail.current)
    cancel()
    if (open) gallery.current?.click()
  }

  function begin(node: HTMLDivElement, x: number, y: number, id: number | null) {
    cancel()
    dragged.current = false
    // Keep a full pull within a thumb's reach, even from the center of a small phone.
    const width = window.visualViewport?.width || window.innerWidth
    const fullPull = Math.min(FULL_PULL, width * 0.45)
    const end = node.scrollWidth - node.clientWidth
    // Once the last print is nearest, a new finger pulls from it while the native snap finishes.
    // A swipe that started on an earlier print still has to travel all the way to the edge first.
    const left = id === null && lastPrintIsNearest(node) ? end : Math.max(0, Math.min(end, node.scrollLeft))
    drag.current = { id, x, y, left, end, fullPull }
  }

  function move(node: HTMLDivElement, x: number, y: number, id: number | null) {
    const start = drag.current
    if (!start || start.id !== id) return
    const dx = start.x - x
    if (!dragged.current) {
      const dy = Math.abs(start.y - y)
      if (Math.max(Math.abs(dx), dy) < 6) return
      if (dy >= Math.abs(dx)) return cancel()
      dragged.current = true
      if (id !== null) {
        node.setPointerCapture?.(id)
        node.setAttribute('data-dragging', '')
      }
    }
    const left = start.left + dx
    // Touch and trackpads scroll natively. Only a mouse needs to move the rail itself.
    if (id !== null) node.scrollTo({ left, behavior: 'instant' })
    const beyond = left - start.end
    // Once a drag crosses the edge, only the finger drives the ring, not a settling scroll offset.
    draw(start.end > 0 ? beyond : 0, start.fullPull)
  }

  function cancelPointer(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id === event.pointerId) cancel()
  }

  return {
    gallery,
    indicator,
    cancel,
    onClick(event: MouseEvent<HTMLAnchorElement>) {
      // Preserve Enter and our own activation of the real link; discard the click following a drag.
      if (dragged.current && event.detail !== 0) {
        event.preventDefault()
        dragged.current = false
      }
    },
    handlers: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType !== 'mouse') return
        dragged.current = false
        if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          begin(event.currentTarget, event.clientX, event.clientY, event.pointerId)
        }
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        move(event.currentTarget, event.clientX, event.clientY, event.pointerId)
      },
      onPointerUp(event: PointerEvent<HTMLDivElement>) {
        if (drag.current?.id === event.pointerId) release()
      },
      onPointerLeave(event: PointerEvent<HTMLDivElement>) {
        if (wheel.current.timer || (drag.current?.id === event.pointerId && !dragged.current)) cancel()
      },
      onLostPointerCapture: cancelPointer,
      onPointerCancel: cancelPointer,
      // A native pan cancels pointer events, but passive touch events still report the finger's travel.
      onTouchStart(event: TouchEvent<HTMLDivElement>) {
        if (event.touches.length !== 1) return cancel()
        const touch = event.touches[0]
        begin(event.currentTarget, touch.clientX, touch.clientY, null)
      },
      onTouchMove(event: TouchEvent<HTMLDivElement>) {
        if (event.touches.length !== 1) return cancel()
        const touch = event.touches[0]
        move(event.currentTarget, touch.clientX, touch.clientY, null)
      },
      onTouchEnd(event: TouchEvent<HTMLDivElement>) {
        if (drag.current?.id !== null) return
        // A browser may coalesce the last move. Honor where the finger actually lifted.
        const touch = event.changedTouches[0]
        if (touch && dragged.current) move(event.currentTarget, touch.clientX, touch.clientY, null)
        release()
      },
      onTouchCancel: cancel,
      onWheel(event: WheelEvent<HTMLDivElement>) {
        if (drag.current) return
        const burst = wheel.current
        const momentum = 'momentum' in event.nativeEvent ? event.nativeEvent.momentum : undefined
        if (momentum === true) {
          if (burst.timer) release()
          burst.last = -Infinity
          return
        }
        const elapsed = event.timeStamp - burst.last
        const fresh = elapsed > WHEEL_IDLE
        burst.last = event.timeStamp
        const node = event.currentTarget
        const shifted = event.shiftKey && event.deltaX === 0
        const dx = shifted ? event.deltaY : event.deltaX
        const dy = shifted ? 0 : Math.abs(event.deltaY)
        if (event.ctrlKey || event.metaKey || event.altKey) return cancel()
        if (dy > Math.abs(dx) * (burst.timer ? 2 : 1)) {
          if (!burst.timer || dy >= 8) cancel()
          return
        }
        if (!dx) return
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientWidth : 1
        const delta = dx * unit
        // Older trackpads don't label inertia. Ignore a tapering tail, but let sustained input
        // cross the edge without lifting. A diagonal sample or tiny reversal mustn't reset the ring.
        if (fresh || delta > burst.previousDelta + 1 || delta <= 0) burst.falling = 0
        else if (delta < burst.previousDelta - 0.5) burst.falling = Math.min(2, burst.falling + 1)
        else if (delta >= 6) burst.falling = Math.max(0, burst.falling - 1)
        burst.previousDelta = delta
        const coasting = momentum !== false && burst.falling >= 2
        const remaining = Math.max(0, node.scrollWidth - node.clientWidth - node.scrollLeft)
        if (!burst.timer && (!lastPrintIsNearest(node) || delta <= 0 || coasting)) return
        if (!coasting) {
          const excess = burst.timer || fresh ? delta : Math.max(0, delta - remaining)
          if (!excess && !burst.timer) return
          // A single wheel notch cannot arm the link; a long hold has bounded elastic travel.
          const change = Math.sign(excess) * Math.min(24, Math.abs(excess), Math.max(0, elapsed) * 0.5)
          const base = change < 0 ? Math.min(FULL_PULL, burst.distance) : burst.distance
          burst.distance = Math.max(0, Math.min(FULL_PULL * 2, base + change))
        }
        draw(burst.distance)
        window.clearTimeout(burst.timer)
        burst.timer = window.setTimeout(release, WHEEL_IDLE)
      },
    },
  }
}

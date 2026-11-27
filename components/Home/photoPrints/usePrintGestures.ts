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

const DEAD_ZONE = 10
const FULL_PULL = 168
// Wheels have no release event. A quiet gap separates a new pull from the previous swipe's momentum.
const WHEEL_IDLE = 180

type Drag = { id: number | null; x: number; y: number; left: number; end: number; fullPull: number }

function atEnd(node: HTMLDivElement) {
  return node.scrollWidth > node.clientWidth && node.scrollWidth - node.clientWidth - node.scrollLeft <= 2
}

export function usePrintGestures(rail: RefObject<HTMLDivElement | null>) {
  const gallery = useRef<HTMLAnchorElement>(null)
  const indicator = useRef<SVGSVGElement>(null)
  const drag = useRef<Drag | null>(null)
  const dragged = useRef(false)
  const travel = useRef(0)
  const wheel = useRef({ last: -Infinity, timer: 0, distance: 0 })

  const draw = useCallback((distance: number, fullPull = FULL_PULL) => {
    const value = Math.max(0, (distance - DEAD_ZONE) / (fullPull - DEAD_ZONE))
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

  function release() {
    const open = travel.current >= 1 && rail.current && atEnd(rail.current)
    cancel()
    if (open) gallery.current?.click()
  }

  function begin(node: HTMLDivElement, x: number, y: number, id: number | null) {
    cancel()
    dragged.current = false
    // Keep a full pull within a thumb's reach, even from the center of a small phone.
    const fullPull = Math.min(FULL_PULL, window.innerWidth * 0.45)
    drag.current = { id, x, y, left: node.scrollLeft, end: node.scrollWidth - node.clientWidth, fullPull }
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
    draw(start.end > 0 && beyond > 0 && atEnd(node) ? beyond : 0, start.fullPull)
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
        const burst = wheel.current
        const elapsed = event.timeStamp - burst.last
        const fresh = elapsed > WHEEL_IDLE
        burst.last = event.timeStamp
        if (drag.current || (!fresh && !burst.timer)) return
        const node = event.currentTarget
        const shifted = event.shiftKey && event.deltaX === 0
        const dx = shifted ? event.deltaY : event.deltaX
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          dx <= (shifted ? 0 : Math.abs(event.deltaY)) ||
          !atEnd(node)
        )
          return cancel()
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientWidth : 1
        // Limit both a single notch and a flurry of accelerated trackpad events (0.5px/ms).
        burst.distance += Math.min(24, dx * unit, Math.max(0, elapsed) * 0.5)
        draw(burst.distance)
        window.clearTimeout(burst.timer)
        burst.timer = window.setTimeout(release, WHEEL_IDLE)
      },
    },
  }
}

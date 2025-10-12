import type { CSSProperties, ElementType, ReactNode } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

const SCROLL_END_DEBOUNCE = 300
const LEFT_BUTTON = 0

const debounce = <T extends (...args: unknown[]) => unknown>(callback: T, wait: number) => {
  let timeoutId: number
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}

const isMobileDevice = (): boolean => {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.includes('IEMobile')
}

interface ScrollEvent {
  external: boolean
}

interface Props {
  vertical?: boolean
  horizontal?: boolean
  hideScrollbars?: boolean
  activationDistance?: number
  children?: ReactNode
  onStartScroll?: (event: ScrollEvent) => void
  onScroll?: (event: ScrollEvent) => void
  onEndScroll?: (event: ScrollEvent) => void
  onClick?: (event: MouseEvent) => void
  className?: string
  draggingClassName?: string
  style?: CSSProperties
  ignoreElements?: string
  nativeMobileScroll?: boolean
  component?: ElementType
  innerRef?: React.Ref<HTMLElement>
  stopPropagation?: boolean
  buttons?: number[]
}

const DragScrollContainer = ({
  vertical = true,
  horizontal = true,
  hideScrollbars,
  activationDistance = 10,
  children,
  onStartScroll,
  onScroll,
  onEndScroll,
  onClick,
  className,
  draggingClassName,
  style,
  ignoreElements,
  nativeMobileScroll = true,
  component: Component = 'div',
  innerRef,
  stopPropagation = false,
  buttons = [LEFT_BUTTON],
}: Props) => {
  const containerRef = useRef<HTMLElement>(null)
  const [pressed, setPressed] = useState(false)
  const [started, setStarted] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [internal, setInternal] = useState(false)
  const [clientX, setClientX] = useState<number>()
  const [clientY, setClientY] = useState<number>()
  const [scrollLeft, setScrollLeft] = useState<number>()
  const [scrollTop, setScrollTop] = useState<number>()
  const [isMobile, setIsMobile] = useState(false)

  const handleScroll = () => {
    const container = containerRef.current
    if (!container || (container.scrollLeft === scrollLeft && container.scrollTop === scrollTop)) return

    setScrolling(true)
    if (started) onScroll?.({ external: !internal })
    else processStart(false)
    realScroll()
  }

  const realScroll = debounce(() => {
    setScrolling(false)
    if (!pressed && started) processEnd()
  }, SCROLL_END_DEBOUNCE)

  const processClick = (clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return
    setScrollLeft(container.scrollLeft)
    setScrollTop(container.scrollTop)
    setClientX(clientX)
    setClientY(clientY)
    setPressed(true)
  }

  const processStart = useCallback(
    (changeCursor = true) => {
      setStarted(true)
      onStartScroll?.({ external: !internal })
      if (changeCursor) document.body.classList.add('body-dragging')
    },
    [internal, onStartScroll]
  )

  const processMove = useCallback(
    (newClientX: number, newClientY: number) => {
      const container = containerRef.current
      if (!container || clientX === undefined || clientY === undefined) return

      const deltaX = newClientX - clientX
      const deltaY = newClientY - clientY

      if (!started) {
        const activateHorizontal = horizontal && Math.abs(deltaX) > activationDistance
        const activateVertical = vertical && Math.abs(deltaY) > activationDistance

        if (activateHorizontal || activateVertical) {
          setClientX(newClientX)
          setClientY(newClientY)
          processStart()
        }
      } else {
        if (horizontal) container.scrollLeft -= deltaX
        if (vertical) container.scrollTop -= deltaY
        onScroll?.({ external: !internal })

        setClientX(newClientX)
        setClientY(newClientY)
        setScrollLeft(container.scrollLeft)
        setScrollTop(container.scrollTop)
      }
    },
    [activationDistance, clientX, clientY, horizontal, internal, onScroll, processStart, started, vertical]
  )

  const processEnd = useCallback(() => {
    onEndScroll?.({ external: !internal })
    setPressed(false)
    setStarted(false)
    setScrolling(false)
    setInternal(false)
    document.body.classList.remove('body-dragging')
  }, [internal, onEndScroll])

  // Set innerRef
  useEffect(() => {
    if (typeof innerRef === 'function') {
      innerRef(containerRef.current)
    } else if (innerRef) {
      innerRef.current = containerRef.current
    }
  }, [innerRef])

  // Touch and Mouse event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (isDraggable(e.target as Element)) {
        setInternal(true)
        if (nativeMobileScroll && scrolling) {
          setPressed(true)
        } else {
          const touch = e.touches[0]
          processClick(touch.clientX, touch.clientY)
          if (!nativeMobileScroll && stopPropagation) {
            e.stopPropagation()
          }
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (pressed && (!nativeMobileScroll || !isMobile)) {
        const touch = e.touches[0]
        processMove(touch.clientX, touch.clientY)

        e.preventDefault()
        if (stopPropagation) e.stopPropagation()
      }
    }

    const handleTouchEnd = () => {
      if (pressed) {
        if (started && (!scrolling || !nativeMobileScroll)) {
          processEnd()
        } else {
          setPressed(false)
        }
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isDraggable(e.target as Element) && isScrollable()) {
        setInternal(true)
        if (buttons.indexOf(e.button) >= 0) {
          processClick(e.clientX, e.clientY)

          e.preventDefault()
          if (stopPropagation) e.stopPropagation()
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!pressed) return
      processMove(e.clientX, e.clientY)

      e.preventDefault()
      if (stopPropagation) e.stopPropagation()
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!pressed) return

      if (started) {
        processEnd()
      } else {
        setInternal(false)
        setPressed(false)
        if (onClick) onClick(e)
      }

      e.preventDefault()
      if (stopPropagation) e.stopPropagation()
    }

    const isDraggable = (target: Element) => {
      if (ignoreElements) {
        const closest = target.closest(ignoreElements)
        return closest === null || closest.contains(container)
      } else {
        return true
      }
    }

    const isScrollable = () => {
      return (
        container && (container.scrollWidth > container.clientWidth || container.scrollHeight > container.clientHeight)
      )
    }

    if (nativeMobileScroll) setIsMobile(isMobileDevice())
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    })
    container.addEventListener('mousedown', handleMouseDown, {
      passive: false,
    })

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('mousedown', handleMouseDown)
    }
  }, [
    buttons,
    ignoreElements,
    isMobile,
    nativeMobileScroll,
    onClick,
    pressed,
    processEnd,
    processMove,
    scrolling,
    started,
    stopPropagation,
  ])

  return (
    <Component
      ref={containerRef}
      className={`
        ${className} 
        ${styles.container} 
        ${pressed ? `${styles.dragging} ${draggingClassName}` : ''} 
        ${isMobile ? styles.nativeScroll : ''} 
        ${hideScrollbars ? styles.hideScrollbars : ''}
      `}
      style={style}
      onScroll={handleScroll}
    >
      {children}
      <style>{'.body-dragging { cursor: grab; }'}</style>
    </Component>
  )
}

export default DragScrollContainer

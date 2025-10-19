import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useEffect, useRef, useState } from 'react'
import DailyEvent from './DailyEvent'
import {
  CurrentDate,
  CurrentDay,
  CurrentTimeBar,
  DailyCalendarStyle,
  DateWrap,
  EventWrap,
  HOUR_BAR_HEIGHT,
  HourBar,
  HourBarTime,
  HourBarWrap,
  HourListWrap,
  StickyHeader,
  Timezone,
} from './styles'
import { addMinutes, computeLayoutStyles, dateToTime, formatTime, getRandomColor, timeToPx } from './utils'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = [...new Array(24)].map((_, i) => i)

const TOUCH_HOLD_DELAY = 500
const BAR_INTERVAL_MINS = 15
const DATE = dayjs()

const createEventItem = (date: Dayjs) => ({
  start: date,
  end: addMinutes(date, BAR_INTERVAL_MINS),
  color: getRandomColor(),
  title: '',
  id: dayjs().valueOf(),
})

export type DailyEventT = ReturnType<typeof createEventItem>

const DailyCalendar = () => {
  const isTouchActiveRef = useRef(false)
  const eventListRef = useRef<HTMLDivElement>(null)

  const [dailyEvents, setDailyEvents] = useState<DailyEventT[]>([])
  const [newEvent, setNewEvent] = useState<DailyEventT | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const updateDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.map((evt) => (evt.id === dailyEvent.id ? dailyEvent : evt)))
  }, [])

  const addDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => [...prev, dailyEvent])
  }, [])

  const deleteDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.filter((evt) => evt.id !== dailyEvent.id))
  }, [])

  const pointerEventToDate = (e: MouseEvent | TouchEvent): Dayjs => {
    const topPos = eventListRef.current?.getBoundingClientRect().top || 0
    const scrollTop = eventListRef.current?.scrollTop || 0
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    // Calculate the y-position of the mouse event relative to the event list, adjusted for scrolling
    const elemY = Math.max(0, clientY - topPos + scrollTop)
    const hour = Math.floor(elemY / HOUR_BAR_HEIGHT)
    const mins = elemY % HOUR_BAR_HEIGHT
    const intervalMins = mins - (mins % BAR_INTERVAL_MINS)

    return DATE.startOf('day').hour(hour).minute(intervalMins).second(0).millisecond(0)
  }

  const startDragCreation = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    moveEventType: 'mousemove' | 'touchmove',
    endEventType: 'mouseup' | 'touchend'
  ) => {
    const date = pointerEventToDate(event.nativeEvent)
    const eventItem = createEventItem(date)
    setNewEvent(eventItem)

    const initialDate = eventItem.start

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const newDate = pointerEventToDate(e)
      if (Math.abs(newDate.valueOf() - initialDate.valueOf()) === 0) return
      // If dragging upwards, swap start and end so that start is always earlier
      eventItem.start = dayjs(Math.min(initialDate.valueOf(), newDate.valueOf()))
      eventItem.end = dayjs(Math.max(initialDate.valueOf(), newDate.valueOf()))
      setNewEvent({ ...eventItem })
    }

    const onEnd = () => {
      document.body.removeEventListener(moveEventType, onMove)
      document.body.removeEventListener(endEventType, onEnd)

      if (Math.abs(eventItem.end.valueOf() - eventItem.start.valueOf()) === 0) return
      addDailyEvent(eventItem)
      setNewEvent(null)

      // Unlock scrolling after touch event creation
      if (endEventType === 'touchend') {
        document.body.style.overflow = ''
        isTouchActiveRef.current = false
      }
    }
    document.body.addEventListener(moveEventType, onMove, { passive: false })
    document.body.addEventListener(endEventType, onEnd, { once: true })
  }

  const onListMouseDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchActiveRef.current) return // Prevent desktop events if a touch event is active
    if (!(mouseDownEvent.nativeEvent.target as HTMLElement).hasAttribute('data-list-events')) return

    mouseDownEvent.nativeEvent.preventDefault()
    setSelectedEventId(null)

    startDragCreation(mouseDownEvent, 'mousemove', 'mouseup')
  }

  const onListTouchStart = (touchStartEvent: React.TouchEvent<HTMLDivElement>) => {
    if (!(touchStartEvent.nativeEvent.target as HTMLElement).hasAttribute('data-list-events')) return

    touchStartEvent.nativeEvent.preventDefault() // Lock scrolling on the event list
    setSelectedEventId(null)
    isTouchActiveRef.current = true

    // Start a hold timer
    const touchHoldTimer = setTimeout(() => {
      document.body.style.overflow = 'hidden' // Lock scrolling on the page
      startDragCreation(touchStartEvent, 'touchmove', 'touchend')
    }, TOUCH_HOLD_DELAY)

    // If touch ends before the hold timer, cancel the event creation
    const onTouchEndEarly = () => {
      clearTimeout(touchHoldTimer)
      isTouchActiveRef.current = false
      document.body.removeEventListener('touchmove', onTouchEndEarly)
      document.body.removeEventListener('touchend', onTouchEndEarly)
    }
    document.body.addEventListener('touchmove', onTouchEndEarly)
    document.body.addEventListener('touchend', onTouchEndEarly)
  }

  useEffect(() => {
    if (!eventListRef.current) return
    // Scroll to the current time
    eventListRef.current.scrollTop = timeToPx(dateToTime(DATE)) - eventListRef.current.clientHeight / 2
  }, [])

  // Compute layout for all events (include newEvent if active)
  const allEvents = [...dailyEvents, ...(newEvent ? [newEvent] : [])]
  const layoutMapping = computeLayoutStyles(allEvents)

  return (
    <DailyCalendarStyle>
      <StickyHeader>
        <Timezone>{DATE.format('z')}</Timezone>
        <DateWrap>
          <CurrentDay>{WEEKDAYS[DATE.day()].substring(0, 3)}</CurrentDay>
          <CurrentDate>{DATE.date()}</CurrentDate>
        </DateWrap>
      </StickyHeader>

      <HourListWrap ref={eventListRef} onMouseDown={onListMouseDown} onTouchStart={onListTouchStart}>
        <EventWrap>
          {/* Existing Events */}
          {dailyEvents.map((dailyEvent) => (
            <DailyEvent
              key={dailyEvent.id}
              dailyEvent={dailyEvent}
              deleteDailyEvent={deleteDailyEvent}
              layoutStyle={layoutMapping[dailyEvent.id]}
              pointerEventToDate={pointerEventToDate}
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
              updateDailyEvent={updateDailyEvent}
            />
          ))}

          {/* New Event */}
          {newEvent ? <DailyEvent dailyEvent={newEvent} layoutStyle={layoutMapping[newEvent.id]} /> : null}
        </EventWrap>

        {/* Current Time */}
        <CurrentTimeBar id="CurrentTime" style={{ top: timeToPx(dateToTime(dayjs())) }} />

        {/* Hours */}
        <HourBarWrap>
          {HOURS.map((hour) => (
            <HourBar key={hour} data-hour={hour} data-list-events>
              <HourBarTime data-list-events>{formatTime(hour)}</HourBarTime>
            </HourBar>
          ))}
        </HourBarWrap>
      </HourListWrap>
    </DailyCalendarStyle>
  )
}

export default DailyCalendar

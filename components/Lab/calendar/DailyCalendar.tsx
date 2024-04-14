import { useCallback, useEffect, useRef, useState } from 'react'
import DailyEvent from './DailyEvent'
import {
  CurrentDate,
  CurrentDay,
  CurrentTimeBar,
  DailyCalendarStyle,
  DateWrap,
  HourBar,
  HourBarTime,
  HourBarWrap,
  HourListWrap,
  HOUR_BAR_HEIGHT,
  StickyHeader,
  Timezone,
} from './styles'
import { addMinutes, dateToTime, formatTime, getRandomColor, timeToPx } from './utils'

export type DailyEventT = {
  start: Date
  end: Date
  title: string
  color: string
  id: number
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = [...new Array(24)].map((_, i) => i)

const BAR_INTERVAL_MINS = 15
const DATE = new Date()

const rectifyDailyEvent = (evt: DailyEventT) => {
  const { start, end } = evt
  const shouldSwap = start > end
  evt.start = shouldSwap ? end : start
  evt.end = shouldSwap ? start : end
  return evt
}

type Props = {
  date: string
}

const DailyCalendar = () => {
  const eventListRef = useRef<HTMLDivElement>(null)
  const [dailyEvents, setDailyEvents] = useState<DailyEventT[]>([])
  const [newEvent, setNewEvent] = useState<DailyEventT | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const updateDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.map((evt) => (evt.id === dailyEvent.id ? rectifyDailyEvent(dailyEvent) : evt)))
  }, [])

  const addDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => [...prev, rectifyDailyEvent(dailyEvent)])
  }, [])

  const deleteDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.filter((evt) => evt.id !== dailyEvent.id))
  }, [])

  const getDateFromPointerEvent = useCallback((e: MouseEvent) => {
    const topPos = eventListRef.current?.getBoundingClientRect().top || 0
    const scrollTop = eventListRef.current?.scrollTop || 0

    // Calculate the y-position of the mouse event relative to the event list, adjusted for scrolling
    const elemY = Math.max(0, e.clientY - topPos + scrollTop)

    const hour = Math.floor(elemY / HOUR_BAR_HEIGHT)
    const mins = elemY % HOUR_BAR_HEIGHT
    const intervalMins = mins - (mins % BAR_INTERVAL_MINS)
    const date = new Date()

    date.setHours(hour)
    date.setMinutes(intervalMins)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
  }, [])

  const onListMouseDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    mouseDownEvent.nativeEvent.preventDefault()
    setSelectedEventId(null)

    const date = getDateFromPointerEvent(mouseDownEvent.nativeEvent)

    const eventItem = {
      start: date,
      end: addMinutes(date, BAR_INTERVAL_MINS),
      color: getRandomColor(),
      title: '',
      id: new Date().getTime(),
    }

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      mouseMoveEvent.preventDefault()
      const newDate = getDateFromPointerEvent(mouseMoveEvent)
      if (Math.abs(newDate.getTime() - date.getTime()) === 0) return

      eventItem.end = newDate
      setNewEvent({ ...eventItem })
    }

    const onMouseUp = () => {
      document.body.removeEventListener('mousemove', onMouseMove)
      if (Math.abs(eventItem.end.getTime() - eventItem.start.getTime()) === 0) return

      addDailyEvent(eventItem)
      setNewEvent(null)
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp, { once: true })
  }

  useEffect(() => {
    if (!eventListRef.current) return
    // Scroll to the current time
    eventListRef.current.scrollTop = timeToPx(dateToTime(DATE)) - eventListRef.current.clientHeight / 2
  }, [])

  return (
    <DailyCalendarStyle>
      <StickyHeader>
        <Timezone>{DATE.toTimeString().slice(9, 15)}</Timezone>
        <DateWrap>
          <CurrentDay>{WEEKDAYS[DATE.getDay()].substring(0, 3)}</CurrentDay>
          <CurrentDate>{DATE.getDate()}</CurrentDate>
        </DateWrap>
      </StickyHeader>

      <HourListWrap ref={eventListRef} onMouseDown={onListMouseDown}>
        {/* Existing Events */}
        {dailyEvents.map((dailyEvent) => (
          <DailyEvent
            dailyEvent={dailyEvent}
            setSelectedEventId={setSelectedEventId}
            selectedEventId={selectedEventId}
            getDateFromPointerEvent={getDateFromPointerEvent}
            updateDailyEvent={updateDailyEvent}
            deleteDailyEvent={deleteDailyEvent}
            key={dailyEvent.id}
          />
        ))}

        {/* New Event */}
        {newEvent && <DailyEvent dailyEvent={newEvent} />}

        {/* Current Time */}
        <CurrentTimeBar style={{ top: timeToPx(dateToTime(new Date())) }} id="CurrentTime" />

        {/* Hours */}
        <HourBarWrap>
          {HOURS.map((hour) => (
            <HourBar key={hour} data-hour={hour}>
              <HourBarTime>{formatTime(hour)}</HourBarTime>
            </HourBar>
          ))}
        </HourBarWrap>
      </HourListWrap>
    </DailyCalendarStyle>
  )
}

export default DailyCalendar

import { useCallback, useEffect, useRef, useState } from 'react'
import DailyEvent from './DailyEvent'
import {
  BarHeight,
  CurrentDate,
  CurrentDay,
  CurrentTimeBar,
  DailyCalendarStyle,
  DateWrap,
  HourBar,
  HourBarTime,
  HourListWrap,
  StickyHeader,
  Timezone,
} from './styles'
import { addMinutes, dateToTime, formatTime, getRandomColor, timeToPx } from './utils'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = [...new Array(24)].map((_, i) => i)

const BarInterval = 15

type Props = {
  date: string
}

export type DailyEventT = {
  start: Date
  end: Date
  title: string
  color: string
  id: number
}

const DailyCalendar = ({ date }: Props) => {
  const DATE = new Date(date)

  const eventListRef = useRef<HTMLDivElement>(null)
  const [dailyEvents, setDailyEvents] = useState<DailyEventT[]>([])
  const [newEvent, setNewEvent] = useState<DailyEventT | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const rectifyDailyEvent = (evt: DailyEventT) => {
    const { start, end } = evt
    const shouldSwap = start > end
    evt.start = shouldSwap ? end : start
    evt.end = shouldSwap ? start : end
    return evt
  }

  const updateDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.map((evt) => (evt.id === dailyEvent.id ? rectifyDailyEvent(dailyEvent) : evt)))
  }, [])

  const addDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => [...prev, rectifyDailyEvent(dailyEvent)])
  }, [])

  const deleteDailyEvent = useCallback((dailyEvent: DailyEventT) => {
    setDailyEvents((prev) => prev.filter((evt) => evt.id !== dailyEvent.id))
  }, [])

  const getDateFromPointerEvent = useCallback((e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const topPos = eventListRef.current?.getBoundingClientRect().top || 0
    const scrollTop = eventListRef.current?.scrollTop || 0

    // Calculate the y-position of the mouse event relative to the event list, adjusted for scrolling
    const elemY = Math.max(0, e.clientY - topPos + scrollTop)

    const hour = Math.floor(elemY / BarHeight)
    const mins = elemY % BarHeight
    const intervalMins = mins - (mins % BarInterval)
    const date = new Date()

    date.setHours(hour)
    date.setMinutes(intervalMins)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
  }, [])

  const handleListMouseDown = useCallback(
    (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
      setSelectedEventId(null)
      const date = getDateFromPointerEvent(mouseDownEvent)

      const eventItem = {
        start: date,
        end: addMinutes(date, BarInterval),
        color: getRandomColor(),
        title: '',
        id: new Date().getTime(),
      }

      // List Mouse Move
      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        const newDate = getDateFromPointerEvent(mouseMoveEvent)
        if (Math.abs(newDate.getTime() - date.getTime()) === 0) return

        eventItem.end = newDate
        setNewEvent({ ...eventItem })
      }

      // List Mouse Up
      const onMouseUp = () => {
        document.body.removeEventListener('mousemove', onMouseMove)
        if (Math.abs(eventItem.end.getTime() - eventItem.start.getTime()) === 0) return

        addDailyEvent(eventItem)
        setNewEvent(null)
      }

      document.body.addEventListener('mousemove', onMouseMove)
      document.body.addEventListener('mouseup', onMouseUp, { once: true })
    },
    [getDateFromPointerEvent, addDailyEvent]
  )

  useEffect(() => {
    if (!eventListRef.current) return
    eventListRef.current.querySelector('#CurrentTime')?.scrollIntoView()
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

      <HourListWrap ref={eventListRef} onMouseDown={handleListMouseDown}>
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

        {HOURS.map((hour) => (
          <HourBar key={hour} data-hour={hour}>
            <HourBarTime>{formatTime(hour)}</HourBarTime>
          </HourBar>
        ))}
      </HourListWrap>
    </DailyCalendarStyle>
  )
}

export default DailyCalendar

import { DailyEventT } from './DailyCalendar'
import { dateToTime, timeToPx } from './utils'

type Props = {
  dailyEvent: DailyEventT
  updateDailyEvent?: (dailyEvent: DailyEventT) => void
  getDateFromPointerEvent?: (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => Date
  setSelectedEventId?: React.Dispatch<React.SetStateAction<number | null>>
  selectedEventId?: number | null
}

const DailyEvent = ({
  dailyEvent,
  updateDailyEvent,
  getDateFromPointerEvent,
  setSelectedEventId,
  selectedEventId,
}: Props) => {
  const getDailyEventBoxStyles = (cursorPos: DailyEventT) => {
    if (!cursorPos) return {}
    const { start, end } = cursorPos
    const startPx = timeToPx(dateToTime(start))
    const endPx = timeToPx(dateToTime(end))
    const shouldSwap = startPx > endPx

    return {
      height: shouldSwap ? startPx - endPx : endPx - startPx,
      top: shouldSwap ? endPx : startPx,
      background: cursorPos.color,
    }
  }

  const onResizeMouseDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>, position: 'start' | 'end') => {
    mouseDownEvent.stopPropagation()
    document.body.style.cursor = 'ns-resize'

    const onMouseMove = (mouseDownEvent: MouseEvent) => {
      if (!getDateFromPointerEvent) return

      const resizedDate = getDateFromPointerEvent(mouseDownEvent)
      const { start, end } = dailyEvent

      if (position === 'start' && resizedDate.getTime() === end.getTime()) return
      if (position === 'end' && resizedDate.getTime() === start.getTime()) return

      const resizedEvent = {
        ...dailyEvent,
        start: position === 'start' ? resizedDate : start,
        end: position === 'end' ? resizedDate : end,
      }

      if (updateDailyEvent) updateDailyEvent(resizedEvent)
    }

    const onMouseUp = () => {
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.style.cursor = 'default'
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp)
  }

  const onContainerMouseDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    mouseDownEvent.stopPropagation()
    setSelectedEventId && setSelectedEventId(dailyEvent.id)
    console.log('click')
  }

  return (
    <div
      className={`calendar__daily-event-container ${selectedEventId === dailyEvent.id ? 'selected' : ''}`}
      style={getDailyEventBoxStyles(dailyEvent)}
      onMouseDown={onContainerMouseDown}
    >
      <div className="calendar__daily-event-relative">
        {!(dailyEvent.start.getTime() === dailyEvent.end.getTime()) && (
          <>
            {/* <p>{dailyEvent.title || 'No Title'}</p> */}
            <p className="calendar__daily-event--time-range">
              {dailyEvent.start < dailyEvent.end
                ? dateToTime(dailyEvent.start, 12) + ' - ' + dateToTime(dailyEvent.end, 12)
                : dateToTime(dailyEvent.end, 12) + ' - ' + dateToTime(dailyEvent.start, 12)}
            </p>
          </>
        )}
        {selectedEventId === dailyEvent.id && (
          <>
            <div className="calendar__resize-event--top" onMouseDown={(e) => onResizeMouseDown(e, 'start')} />
            <div className="calendar__resize-event--bottom" onMouseDown={(e) => onResizeMouseDown(e, 'end')} />
          </>
        )}
      </div>
    </div>
  )
}

export default DailyEvent

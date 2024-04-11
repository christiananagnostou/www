import { DailyEventT } from './DailyCalendar'
import { dateToTime, timeToPx } from './utils'

type Props = {
  dailyEvent: DailyEventT
  updateDailyEvent?: (dailyEvent: DailyEventT) => void
  getDateFromPointerEvent?: (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => Date
  selectedEventId?: number | null
  setSelectedEventId?: React.Dispatch<React.SetStateAction<number | null>>
  deleteDailyEvent?: (dailyEvent: DailyEventT) => void
}

const DailyEvent = ({
  dailyEvent,
  updateDailyEvent,
  getDateFromPointerEvent,
  selectedEventId,
  setSelectedEventId,
  deleteDailyEvent,
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
          <div className="calendar__daily-event-inner">
            {/* <p>{dailyEvent.title || 'No Title'}</p> */}
            <p className="calendar__daily-event--time-range">
              {dailyEvent.start < dailyEvent.end
                ? dateToTime(dailyEvent.start, 12) + ' - ' + dateToTime(dailyEvent.end, 12)
                : dateToTime(dailyEvent.end, 12) + ' - ' + dateToTime(dailyEvent.start, 12)}
            </p>

            {/* Delete */}
            {selectedEventId === dailyEvent.id && (
              <button
                className="calendar__daily-event-delete"
                onClick={() => deleteDailyEvent && deleteDailyEvent(dailyEvent)}
                aria-label="Delete event"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="14px"
                  width="14px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
                </svg>
              </button>
            )}
          </div>
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

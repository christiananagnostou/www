import X from '../../SVG/X'
import { DailyEventT } from './DailyCalendar'
import {
  DailyEventContainer,
  DailyEventInner,
  DailyEventRelative,
  DeleteButton,
  ResizeEvent,
  TimeRange,
} from './styles'
import { dateToTime, timeToPx } from './utils'

type Props = {
  dailyEvent: DailyEventT
  updateDailyEvent?: (dailyEvent: DailyEventT) => void
  getDateFromPointerEvent?: (e: MouseEvent) => Date
  selectedEventId?: number | null
  setSelectedEventId?: React.Dispatch<React.SetStateAction<number | null>>
  deleteDailyEvent?: (dailyEvent: DailyEventT) => void
}

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

const DailyEvent = ({
  dailyEvent,
  updateDailyEvent,
  getDateFromPointerEvent,
  selectedEventId,
  setSelectedEventId,
  deleteDailyEvent,
}: Props) => {
  const onResizeDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>, position: 'start' | 'end') => {
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
    if (!setSelectedEventId) return
    mouseDownEvent.stopPropagation()
    selectedEventId === dailyEvent.id ? setSelectedEventId(null) : setSelectedEventId(dailyEvent.id)
  }

  return (
    <DailyEventContainer
      className={selectedEventId === dailyEvent.id ? 'selected' : ''}
      style={getDailyEventBoxStyles(dailyEvent)}
      onMouseDown={onContainerMouseDown}
    >
      <DailyEventRelative>
        {!(dailyEvent.start.getTime() === dailyEvent.end.getTime()) && (
          <DailyEventInner>
            <TimeRange>
              {dailyEvent.start < dailyEvent.end
                ? dateToTime(dailyEvent.start, 12) + ' - ' + dateToTime(dailyEvent.end, 12)
                : dateToTime(dailyEvent.end, 12) + ' - ' + dateToTime(dailyEvent.start, 12)}
            </TimeRange>

            {/* Delete */}
            {selectedEventId === dailyEvent.id && (
              <DeleteButton onClick={() => deleteDailyEvent && deleteDailyEvent(dailyEvent)} aria-label="Delete event">
                <X />
              </DeleteButton>
            )}
          </DailyEventInner>
        )}
        {selectedEventId === dailyEvent.id && (
          <>
            <ResizeEvent onMouseDown={(e) => onResizeDown(e, 'start')} style={{ top: 'calc(var(--height) / -2)' }} />
            <ResizeEvent onMouseDown={(e) => onResizeDown(e, 'end')} style={{ bottom: 'calc(var(--height) / -2)' }} />
          </>
        )}
      </DailyEventRelative>
    </DailyEventContainer>
  )
}

export default DailyEvent

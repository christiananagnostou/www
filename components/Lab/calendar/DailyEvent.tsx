import { Dayjs } from 'dayjs'
import X from '../../SVG/X'
import { DailyEventT } from './DailyCalendar'
import { DailyEventContainer, DailyEventInner, DailyEventRelative, DeleteButton, ResizeBar, TimeRange } from './styles'
import { dateToTime, timeToPx } from './utils'

type LayoutStyle = {
  left: string
  width: string
}

type Props = {
  dailyEvent: DailyEventT
  updateDailyEvent?: (dailyEvent: DailyEventT) => void
  pointerEventToDate?: (e: MouseEvent) => Dayjs
  selectedEventId?: number | null
  setSelectedEventId?: React.Dispatch<React.SetStateAction<number | null>>
  deleteDailyEvent?: (dailyEvent: DailyEventT) => void
  layoutStyle?: LayoutStyle
}

const getDailyEventBoxStyles = (event: DailyEventT, layoutStyle?: LayoutStyle) => {
  const startPx = timeToPx(dateToTime(event.start))
  const endPx = timeToPx(dateToTime(event.end))

  return {
    height: Math.abs(endPx - startPx),
    top: Math.min(startPx, endPx),
    background: event.color,
    ...layoutStyle,
  }
}

const DailyEvent = ({
  dailyEvent,
  updateDailyEvent,
  pointerEventToDate,
  selectedEventId,
  setSelectedEventId,
  deleteDailyEvent,
  layoutStyle,
}: Props) => {
  const onResizeDown = (mouseDownEvent: React.MouseEvent<HTMLDivElement>, position: 'start' | 'end') => {
    mouseDownEvent.stopPropagation()
    document.body.style.cursor = 'ns-resize'

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      if (!pointerEventToDate) return

      const resizedDate = pointerEventToDate(mouseMoveEvent)
      const { start, end } = dailyEvent

      if (position === 'start' && resizedDate.valueOf() === end.valueOf()) return
      if (position === 'end' && resizedDate.valueOf() === start.valueOf()) return

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

  const onContainerClick = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    if (!setSelectedEventId) return
    clickEvent.stopPropagation()
    selectedEventId === dailyEvent.id ? setSelectedEventId(null) : setSelectedEventId(dailyEvent.id)
  }

  return (
    <DailyEventContainer
      className={selectedEventId === dailyEvent.id ? 'selected' : ''}
      style={getDailyEventBoxStyles(dailyEvent, layoutStyle)}
      onClick={onContainerClick}
    >
      <DailyEventRelative>
        {dailyEvent.start.valueOf() !== dailyEvent.end.valueOf() && (
          <DailyEventInner>
            <TimeRange>
              {dailyEvent.start.isBefore(dailyEvent.end)
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
            <ResizeBar onMouseDown={(e) => onResizeDown(e, 'start')} style={{ top: 'calc(var(--height) / -2)' }} />
            <ResizeBar onMouseDown={(e) => onResizeDown(e, 'end')} style={{ bottom: 'calc(var(--height) / -2)' }} />
          </>
        )}
      </DailyEventRelative>
    </DailyEventContainer>
  )
}

export default DailyEvent

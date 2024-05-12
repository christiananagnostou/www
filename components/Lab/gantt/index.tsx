import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import DateBar from './DateBar'
import ItemBar from './ItemBar'
import ItemTitle from './ItemTitle'
import TodayCursor from './TodayCursor'
import { getItemsChildrenMap, getItemsDateRange, getNumDaysShown } from './utils'

import {
  Chart,
  GanttContainer,
  Label,
  LeftSide,
  Legend,
  LegendColor,
  LegendItem,
  Resizer,
  RightSide,
  ScrollToTodayBtn,
  Title,
  TopBar,
  ZoomInput,
  ZoomTitle,
} from './styles'

dayjs.extend(relativeTime)
dayjs.extend(minMax)

export type ItemProps = {
  id: string | number
  startDate: string | dayjs.Dayjs
  endDate: string | dayjs.Dayjs
  title: string
  barColor?: string
  barLabel?: string
  parentId?: string | number
}

type GanttProps = {
  items: ItemProps[]
  defaultZoom: number
  chartTitle: string
  legend?: { label: string; color: string }[]
}

export const RowHeight = 35

const Gantt = ({ items, defaultZoom = 10, chartTitle, legend }: GanttProps) => {
  const [dateWidth, setDateWidth] = useState(defaultZoom)

  const itemsDateRange = useMemo(() => getItemsDateRange(items), [items])
  const numDaysShown = useMemo(() => getNumDaysShown(itemsDateRange), [itemsDateRange])
  const itemsChildrenMap = useMemo(() => getItemsChildrenMap(items), [items])

  const resizer = useRef<HTMLDivElement | null>(null)
  const leftSide = useRef<HTMLDivElement | null>(null)
  const rightSide = useRef<HTMLDivElement | null>(null)
  const rightSideStartingWidth = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })

  const handleRowMouseOver = (id: ItemProps['id']) => {
    if (!rightSide.current || !leftSide.current) return

    const bars = rightSide.current.querySelectorAll('.gantt-bar') as NodeListOf<HTMLDivElement>
    const titles = leftSide.current.querySelectorAll('.gantt-title') as NodeListOf<HTMLButtonElement>

    bars.forEach((bar, i) => {
      bar.dataset.itemId == id ? bar.classList.add('hovered') : bar.classList.remove('hovered')
      titles[i].dataset.itemId == id ? titles[i].classList.add('hovered') : titles[i].classList.remove('hovered')
    })
  }

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = e.type.startsWith('touch')

    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY

    mousePos.current = { x: clientX, y: clientY }
    rightSideStartingWidth.current = rightSide.current?.getBoundingClientRect().width || 0

    if (isTouch) {
      document.addEventListener('touchend', handleResizeEnd)
      document.addEventListener('touchmove', handleResizeMove)
    } else {
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('mousemove', handleResizeMove)
    }
  }

  const handleResizeMove = (e: MouseEvent | TouchEvent) => {
    const isTouch = e.type.startsWith('touch')
    const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
    const dx = clientX - mousePos.current.x
    const parent = resizer.current?.parentNode as HTMLDivElement | null
    const parentWidth = parent?.getBoundingClientRect().width || 1

    const newRightWidth = ((rightSideStartingWidth.current - dx) * 100) / parentWidth
    rightSide.current?.style.setProperty('width', `${newRightWidth}%`)

    document.documentElement.style.setProperty('cursor', 'col-resize')
    leftSide.current?.style.setProperty('pointer-events', 'none')
    rightSide.current?.style.setProperty('pointer-events', 'none')
  }

  const handleResizeEnd = () => {
    document.documentElement.style.removeProperty('cursor')
    leftSide.current?.style.removeProperty('pointer-events')
    rightSide.current?.style.removeProperty('pointer-events')

    document.removeEventListener('mouseup', handleResizeEnd)
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('touchend', handleResizeEnd)
    document.removeEventListener('touchmove', handleResizeMove)
  }

  const scrollToDate = useCallback((targetDate: string | dayjs.Dayjs, behavior: ScrollOptions['behavior']) => {
    const dateElem = document.getElementById(dayjs(targetDate).format('YYYY-MMM-D'))
    if (!dateElem) return
    dateElem.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
  }, [])

  useEffect(() => {
    scrollToDate(dayjs(), 'auto')
  }, [scrollToDate])

  return (
    <GanttContainer>
      <TopBar>
        <Title>{chartTitle}</Title>
        <Label>
          <ZoomTitle>Zoom:</ZoomTitle>
          <ZoomInput
            type="range"
            min="10"
            max="40"
            value={dateWidth}
            onChange={(e) => setDateWidth(parseInt(e.target.value))}
            step="1"
          />
        </Label>
      </TopBar>

      <Chart>
        <LeftSide ref={leftSide}>
          <ScrollToTodayBtn onClick={() => scrollToDate(dayjs(), 'smooth')}>
            {dayjs().format('ddd, MMM D')}
          </ScrollToTodayBtn>

          {itemsChildrenMap.get('root')?.map((item, i) => (
            <ItemTitle
              key={item.id + '_title'}
              item={item}
              idx={i}
              level={0}
              itemsChildrenMap={itemsChildrenMap}
              handleRowMouseOver={handleRowMouseOver}
              scrollToDate={scrollToDate}
            />
          ))}
        </LeftSide>

        <Resizer ref={resizer} onMouseDown={handleResizeStart} onTouchStart={handleResizeStart} />

        <RightSide ref={rightSide}>
          <div style={{ width: dateWidth * numDaysShown, position: 'relative' }}>
            <TodayCursor dateWidth={dateWidth} itemsDateRange={itemsDateRange} />

            <DateBar
              itemsDateRange={itemsDateRange}
              numDaysShown={numDaysShown}
              dateWidth={dateWidth}
              scrollToDate={scrollToDate}
            />

            {itemsChildrenMap.get('root')?.map((item) => (
              <ItemBar
                key={item.id + '_bar'}
                item={item}
                dateWidth={dateWidth}
                numDaysShown={numDaysShown}
                itemsDateRange={itemsDateRange}
                itemsChildrenMap={itemsChildrenMap}
                handleRowMouseOver={handleRowMouseOver}
              />
            ))}
          </div>
        </RightSide>
      </Chart>

      {legend && (
        <Legend>
          {legend.map((symbol) => (
            <LegendItem key={symbol.color}>
              <LegendColor style={{ backgroundColor: symbol.color }} />
              {symbol.label}
            </LegendItem>
          ))}
        </Legend>
      )}
    </GanttContainer>
  )
}

export default Gantt

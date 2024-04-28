import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import { useScrollSync } from '../../Hooks'
import DateBar from './DateBar'
import ItemBar from './ItemBar'
import ItemTitle from './ItemTitle'
import {
  BarsContainer,
  Chart,
  GanttContainer,
  Label,
  LeftSide,
  Legend,
  LegendColor,
  LegendItem,
  Resizer,
  RightSide,
  StickyTop,
  Title,
  TodayBar,
  TopBar,
  ZoomInput,
  ZoomTitle,
} from './styles'
import { getDayDiff, getItemsChildrenMap, getItemsDateRange, getNumDaysShown } from './utils'

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

export const RowHeight = 40

const Gantt = ({ items, defaultZoom = 10, chartTitle, legend }: GanttProps) => {
  const [dateWidth, setDateWidth] = useState(defaultZoom)

  const id = useId()
  const { pathname } = useRouter()

  const itemsDateRange = useMemo(() => getItemsDateRange(items), [items])
  const numDaysShown = useMemo(() => getNumDaysShown(itemsDateRange), [itemsDateRange])
  const itemsChildrenMap = useMemo(() => getItemsChildrenMap(items), [items])

  const resizer = useRef(null as HTMLDivElement | null)
  const leftSide = useRef(null as HTMLDivElement | null)
  const rightSide = useRef(null as HTMLDivElement | null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const rightWidth = useRef(0)

  const dateBar = useScrollSync(id)
  const barsContainer = useScrollSync(id)

  const handleRowMouseOver = (id: ItemProps['id']) => {
    if (!barsContainer.current || !leftSide.current) return

    const bars = barsContainer.current.querySelectorAll('.gantt-bar') as NodeListOf<HTMLDivElement>
    const titles = leftSide.current.querySelectorAll('.gantt-title') as NodeListOf<HTMLButtonElement>

    // Highlight background of bar and title of row with id
    bars.forEach((bar, i) => {
      bar.dataset.itemId == id ? bar.classList.add('hovered') : bar.classList.remove('hovered')
      titles[i].dataset.itemId == id ? titles[i].classList.add('hovered') : titles[i].classList.remove('hovered')
    })
  }

  // Handle the mousedown event when user drags the resizer
  const mouseDownHandler = (e: React.MouseEvent) => {
    if (!rightSide.current) return
    // Get the current mouse position
    mouseX.current = e.clientX
    mouseY.current = e.clientY
    rightWidth.current = rightSide.current.getBoundingClientRect().width

    // Attach the listeners to document
    document.addEventListener('mouseup', mouseUpHandler)
    document.addEventListener('mousemove', mouseMoveHandler)
  }

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!leftSide.current || !rightSide.current || !resizer.current) return

    // How far the mouse/thumb has been moved
    const dx = e.clientX - mouseX.current
    const parent = resizer.current.parentNode as HTMLDivElement | null
    const parentWidth = parent?.getBoundingClientRect().width

    const newRightWidth = ((rightWidth.current - dx) * 100) / (parentWidth || 1)
    rightSide.current.style.width = `${newRightWidth}%`

    document.documentElement.style.cursor = 'col-resize'

    leftSide.current.style.pointerEvents = 'none'
    rightSide.current.style.pointerEvents = 'none'
  }

  const mouseUpHandler = () => {
    document.documentElement.style.removeProperty('cursor')
    if (!leftSide.current || !rightSide.current) return

    leftSide.current.style.removeProperty('pointer-events')
    rightSide.current.style.removeProperty('pointer-events')

    // Remove the handlers of mousemove and mouseup
    document.removeEventListener('mouseup', mouseUpHandler)
    document.removeEventListener('mousemove', mouseMoveHandler)
  }

  const renderTodayBar = () => {
    const { firstDate } = itemsDateRange
    const offsetDaysStart = getDayDiff(firstDate, dayjs())
    const barWidth = 2
    return <TodayBar width={barWidth} offsetDays={offsetDaysStart} dateWidth={dateWidth} />
  }

  const scrollToDate = useCallback(
    (targetDate: string | dayjs.Dayjs, behavior: ScrollOptions['behavior']) => {
      const currDayDiv = document.getElementById(dayjs(targetDate).format('YYYY-MMM-D'))
      if (!currDayDiv || !dateBar.current) return

      const colWidth = currDayDiv.offsetWidth
      const containerWidth = dateBar.current.offsetWidth
      const centerOfCurrDayDiv = currDayDiv.offsetLeft - containerWidth / 2 + colWidth / 2

      dateBar.current.scrollTo({ left: centerOfCurrDayDiv, behavior })
    },
    [dateBar]
  )

  useEffect(() => {
    scrollToDate(dayjs(), 'auto')
  }, [scrollToDate, pathname])

  return (
    <GanttContainer>
      {/* Top Bar */}
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

      {/* Chart */}
      <Chart>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Left Side */}
          <LeftSide ref={leftSide}>
            <StickyTop>{/* <button onClick={() => scrollToDate(dayjs(), 'smooth')}>Today</button> */}</StickyTop>

            {/* Titles */}
            <div style={{ overflow: 'hidden' }}>
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
            </div>
          </LeftSide>

          {/* Resizer */}
          <Resizer ref={resizer} onMouseDown={mouseDownHandler} />

          {/* Right Side */}
          <RightSide ref={rightSide}>
            {/* Date Bar */}
            <StickyTop ref={dateBar}>
              <DateBar
                itemsDateRange={itemsDateRange}
                numDaysShown={numDaysShown}
                dateWidth={dateWidth}
                scrollToDate={scrollToDate}
              />
            </StickyTop>

            {/* Bars */}
            <BarsContainer ref={barsContainer}>
              {renderTodayBar()}
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
            </BarsContainer>
          </RightSide>
        </div>
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

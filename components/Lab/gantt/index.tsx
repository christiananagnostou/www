import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import DateBar from './DateBar'
import ItemBar from './ItemBar'
import ItemTitle from './ItemTitle'
import TodayCursor from './TodayCursor'
import { getItemsChildrenMap, getItemsDateRange, getNumDaysShown } from './utils'
import DragScrollContainer from '../../Shared/DragScrollContainer'

import styles from './Gantt.module.css'

dayjs.extend(relativeTime)
dayjs.extend(minMax)

export interface ItemProps {
  id: string | number
  startDate: string | dayjs.Dayjs
  endDate: string | dayjs.Dayjs
  title: string
  barColor?: string
  barLabel?: string
  parentId?: string | number
}

interface GanttProps {
  items: ItemProps[]
  defaultZoom: number
  chartTitle: string
  legend?: Array<{ label: string; color: string }>
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

    const bars = rightSide.current.querySelectorAll<HTMLElement>('.gantt-bar')
    const titles = leftSide.current.querySelectorAll<HTMLElement>('.gantt-title')
    const targetId = String(id)

    bars.forEach((bar, i) => {
      bar.classList.toggle('hovered', bar.dataset.itemId === targetId)
      titles[i]?.classList.toggle('hovered', titles[i]?.dataset.itemId === targetId)
    })
  }

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = e.type.startsWith('touch')

    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY

    mousePos.current = { x: clientX, y: clientY }
    rightSideStartingWidth.current = rightSide.current?.getBoundingClientRect().width ?? 0

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
    <div className={styles.ganttContainer}>
      <div className={styles.topBar}>
        <p className={styles.title}>{chartTitle}</p>
        <label className={styles.label}>
          <span className={styles.zoomTitle}>Zoom:</span>
          <input
            className={styles.zoomInput}
            max="40"
            min="10"
            step="1"
            type="range"
            value={dateWidth}
            onChange={(e) => setDateWidth(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.chart}>
        <div className={styles.leftSide} ref={leftSide}>
          <button className={styles.scrollToTodayBtn} onClick={() => scrollToDate(dayjs(), 'smooth')}>
            {dayjs().format('ddd, MMM D')}
          </button>

          {itemsChildrenMap.get('root')?.map((item, i) => (
            <ItemTitle
              key={`${item.id}_title`}
              handleRowMouseOver={handleRowMouseOver}
              idx={i}
              item={item}
              itemsChildrenMap={itemsChildrenMap}
              level={0}
              scrollToDate={scrollToDate}
            />
          ))}
        </div>

        <div
          className={styles.resizer}
          ref={resizer}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        />

        <DragScrollContainer className={styles.rightSide} hideScrollbars innerRef={rightSide}>
          <div style={{ width: dateWidth * numDaysShown, position: 'relative' }}>
            <TodayCursor dateWidth={dateWidth} itemsDateRange={itemsDateRange} />

            <DateBar
              dateWidth={dateWidth}
              itemsDateRange={itemsDateRange}
              numDaysShown={numDaysShown}
              scrollToDate={scrollToDate}
            />

            {itemsChildrenMap.get('root')?.map((item) => (
              <ItemBar
                key={`${item.id}_bar`}
                dateWidth={dateWidth}
                handleRowMouseOver={handleRowMouseOver}
                item={item}
                itemsChildrenMap={itemsChildrenMap}
                itemsDateRange={itemsDateRange}
              />
            ))}
          </div>
        </DragScrollContainer>
      </div>

      {legend ? (
        <div className={styles.legend}>
          {legend.map((symbol) => (
            <div className={styles.legendItem} key={symbol.color}>
              <span className={styles.legendColor} style={{ backgroundColor: symbol.color }} />
              {symbol.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Gantt

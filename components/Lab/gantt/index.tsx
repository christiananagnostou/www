import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'next/router'
import React, { MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import styled from 'styled-components'
import { useScrollSync } from '../../Hooks'
import ChildArrow from './ChildArrow'

dayjs.extend(relativeTime)
dayjs.extend(minMax)

type ItemProps = {
  id: string | number
  startDate: string | dayjs.Dayjs
  endDate: string | dayjs.Dayjs
  title: string
  barColor?: string
  barLabel?: string
  startLabel?: string
  endLabel?: string
  parentId?: string | number
}

type GanttProps = {
  items: ItemProps[]
  defaultZoom: number
  chartHeight: string
  chartTitle: string
  legend: { label: string; color: string }[]
  className: string
}

const RowHeight = 40

const Gantt = ({ items, defaultZoom = 10, chartHeight = '70vh', chartTitle, legend, className }: GanttProps) => {
  const [dateWidth, setDateWidth] = useState(defaultZoom)

  const id = useId()
  const { pathname } = useRouter()
  // const location = useLocation();

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
      bar.dataset.itemId === id
        ? bar.classList.add('bg-gray-200', 'dark:bg-slate-800')
        : bar.classList.remove('bg-gray-200', 'dark:bg-slate-800')
      titles[i].dataset.itemId === id
        ? titles[i].classList.add('bg-gray-200', 'dark:bg-slate-800')
        : titles[i].classList.remove('bg-gray-200', 'dark:bg-slate-800')
    })
  }

  // Handle the mousedown event when user drags the resizer
  const mouseDownHandler = function (e: MouseEvent) {
    if (!rightSide.current) return
    // Get the current mouse position
    mouseX.current = e.clientX
    mouseY.current = e.clientY
    rightWidth.current = rightSide.current.getBoundingClientRect().width

    // Attach the listeners to document
    document.addEventListener('mouseup', mouseUpHandler)
    document.addEventListener('mousemove', mouseMoveHandler as unknown as EventListenerOrEventListenerObject)
  }

  const mouseMoveHandler = function (e?: MouseEvent) {
    if (!leftSide.current || !rightSide.current || !resizer.current) return
    if (!e) return

    // How far the mouse/thumb has been moved
    const dx = e.clientX - mouseX.current
    const parent = resizer.current.parentNode as HTMLDivElement | null
    const parentWidth = parent?.getBoundingClientRect().width

    const newRightWidth = ((rightWidth.current - dx) * 100) / (parentWidth || 1)
    rightSide.current.style.width = `${newRightWidth}%`

    document.documentElement.style.cursor = 'col-resize'

    leftSide.current.style.userSelect = 'none'
    leftSide.current.style.pointerEvents = 'none'
    rightSide.current.style.userSelect = 'none'
    rightSide.current.style.pointerEvents = 'none'
  }

  const mouseUpHandler = function () {
    document.documentElement.style.removeProperty('cursor')
    if (!leftSide.current || !rightSide.current) return

    leftSide.current.style.removeProperty('user-select')
    leftSide.current.style.removeProperty('pointer-events')
    rightSide.current.style.removeProperty('user-select')
    rightSide.current.style.removeProperty('pointer-events')

    // Remove the handlers of mousemove and mouseup
    document.removeEventListener('mouseup', mouseUpHandler)
    document.removeEventListener('mousemove', mouseMoveHandler as unknown as EventListenerOrEventListenerObject)
  }

  /**
   *
   * @param {Date | string} startDate
   * @param {Date | string} endDate
   * @returns Number of days between start date and end date
   */
  const getDayDiff = (startDate: string | dayjs.Dayjs, endDate: string | dayjs.Dayjs) => {
    return Math.abs(dayjs(startDate).diff(endDate, 'days'))
  }

  /**
   *
   * @returns Min and Max dates from items +/- 7 days
   */
  const getItemsDateRange = useMemo(() => {
    const startDates: dayjs.Dayjs[] = []
    const endDates: dayjs.Dayjs[] = []

    items.forEach((item) => {
      const { startDate, endDate } = item
      startDates.push(dayjs(startDate))
      endDates.push(dayjs(endDate))
    })

    // max and min day +/- 7 days
    const firstDate = dayjs.min(startDates.filter((date) => date.isValid()))?.subtract(7, 'day')
    const lastDate = dayjs.max(endDates.filter((date) => date.isValid()))?.add(7, 'day')

    return { firstDate, lastDate }
  }, [items])

  /**
   *
   * @returns The number of days currently shown on the chart
   */
  const getNumDaysShown = () => {
    const { firstDate, lastDate } = getItemsDateRange
    const daysBetween = getDayDiff(firstDate, lastDate)
    return daysBetween + 1 // +1 to include last date
  }

  const renderDates = () => {
    const numDaysShown = getNumDaysShown()
    const { lastDate } = getItemsDateRange

    const dates = Array(numDaysShown)
      .fill(null)
      .map((_, i) => dayjs(lastDate).subtract(i, 'day').format('YYYY-MMM-D'))
      .reverse()

    return dates.map((date) => {
      const splits = date.split('-')
      const year = splits[0]
      const month = splits[1]
      const day = splits[2]
      const isToday = dayjs().isSame(date, 'day')

      const opacity = () => {
        if (dateWidth > 20) return 1
        const dayInterval = 4 // Number of days until another date is shown on low zoom
        if ((parseInt(day) + (dayInterval - (dayjs().get('D') % dayInterval))) % dayInterval !== 0) return 0
        return 1
      }

      return (
        <button
          className="relative h-full text-sm"
          id={id + '-' + date}
          key={date}
          onClick={() => scrollToDate(date)}
          style={{ width: `${dateWidth}px` }}
        >
          <div className="absolute bottom-0 -translate-x-[50%]" style={{ left: `${dateWidth / 2}px` }}>
            {day === '1' && (
              <span>
                {month === 'Jan' && year}
                {month}
              </span>
            )}
            <span
              style={{ opacity: opacity() }}
              className={`date mx-auto grid place-items-center ${isToday && 'text-white'}`}
            >
              {isToday && <span className="absolute z-[-1] h-5 w-5 rounded-full bg-[#3350E8]" />}
              {day}
            </span>
          </div>
        </button>
      )
    })
  }

  /**
   *
   * @returns the children for any given item (passing 'root' returns all tasks without a parent)
   */
  const itemChildrenMap = useMemo(() => {
    const childrenMap = new Map<string | number, GanttProps['items']>()
    items.forEach((item) =>
      childrenMap.set(item.parentId || 'root', [...(childrenMap.get(item.parentId || 'root') || []), item])
    )
    return childrenMap
  }, [items])

  const renderItemTitle = (item: GanttProps['items'][0], idx: number, level = 1) => {
    const children = itemChildrenMap.get(item.id)

    // Count children of previous sibling
    const parent = itemChildrenMap.get(item.parentId || 'root') || []
    const prevSibling = parent[idx - 1]
    let prevChildCount = 0

    const countChildren = (itemId: ItemProps['id'], count = 0) => {
      const childs = itemChildrenMap.get(itemId)
      childs?.forEach((child) => (count += countChildren(child.id)))
      return count + (childs?.length || 0)
    }
    if (prevSibling && item.parentId) prevChildCount = countChildren(prevSibling.id)

    return (
      <React.Fragment key={item.id + '_title-fragment'}>
        <button
          key={item.id + '_title'}
          data-item-id={item.id}
          className="gantt-title flex w-full items-center pr-1 text-left"
          onMouseEnter={() => handleRowMouseOver(item.id)}
          onMouseLeave={() => handleRowMouseOver(-1)}
          onClick={() => scrollToDate(item.startDate || dayjs().format('YYYY-MM-DD'), false)}
          style={{
            paddingLeft: `${level * (level > 1 ? 12 : 8)}px`,
            height: `${RowHeight}px`,
          }}
        >
          {item.parentId && (
            <span className="relative z-[0]">
              <span
                className="absolute left-[3px] block w-[1px] bg-current"
                style={
                  idx > 0
                    ? {
                        height: `${(prevChildCount ? prevChildCount + 1 : 1) * 40 - 2}px`,
                        top: `-${(prevChildCount ? prevChildCount + 1 : 1) * 40 - 10}px`,
                        background: item.barColor,
                      }
                    : {
                        height: `${27}px`,
                        top: `-${17}px`,
                        background: item.barColor,
                      }
                }
              />
              <span className="block pb-[3px]" style={{ color: item.barColor }}>
                <ChildArrow height={16} width={16} />
              </span>
            </span>
          )}
          <span className="truncate">{item.title}</span>
        </button>

        {children?.map((child, i) => renderItemTitle(child, i, level + 1))}
      </React.Fragment>
    )
  }

  const renderItemBar = (item: ItemProps) => {
    const { startDate, endDate } = item
    const daysBetween = getDayDiff(startDate, endDate)

    const { firstDate } = getItemsDateRange
    const offsetDaysStart = getDayDiff(firstDate, endDate)

    const minWidth = dateWidth / 3
    const barWidth = daysBetween * dateWidth
    // Used to push items with 0 daysBetween behind today bar
    const startsAndEndsToday = dayjs(startDate).isSame(endDate, 'day') && dayjs(endDate).isSame(dayjs(), 'day')

    return (
      <React.Fragment key={item.id + '_bar-fragment'}>
        <div
          key={item.id + '_bar'}
          data-item-id={item.id}
          className="gantt-bar inline-flex select-none items-center"
          onMouseEnter={() => handleRowMouseOver(item.id)}
          onMouseLeave={() => handleRowMouseOver(-1)}
          style={{
            width: `${dateWidth * getNumDaysShown()}px`,
            height: `${RowHeight}px`,
          }}
        >
          <div key={item.id + '_bar'} className="" style={{ marginRight: `${dateWidth * 7}px` }}>
            <div
              className="relative  flex items-center justify-between rounded text-[.65rem] dark:bg-slate-800 dark:text-slate-400"
              style={{
                width: `${barWidth || minWidth}px`,
                height: `${RowHeight / 2}px`,
                marginLeft: `${
                  offsetDaysStart * dateWidth - (barWidth || (startsAndEndsToday ? minWidth : 0)) + dateWidth / 2
                }px`,
                background: item.barColor,
              }}
            >
              {item.barLabel && barWidth > 100 && (
                <span className="sticky left-0 ml-1 w-full truncate text-black">{item.barLabel}</span>
              )}
              {item.startLabel && (
                <span className="absolute right-[calc(100%+.3rem)] z-[15] min-w-max">{item.startLabel}</span>
              )}
              {item.endLabel && (
                <span className="absolute left-[calc(100%+.3rem)] z-[15] min-w-max">{item.endLabel}</span>
              )}
            </div>
          </div>
        </div>

        {itemChildrenMap.get(item.id)?.map((child) => renderItemBar(child))}
      </React.Fragment>
    )
  }

  const renderTodayBar = () => {
    const { firstDate } = getItemsDateRange
    const offsetDaysStart = getDayDiff(firstDate, dayjs())
    const barWidth = 2
    return (
      <div
        className="absolute z-10 h-full bg-[#3350E8]"
        style={{
          width: `${barWidth}px`,
          left: `${offsetDaysStart * dateWidth + dateWidth / 2 - barWidth / 2}px`,
        }}
      />
    )
  }

  const scrollToDate = useCallback(
    (targetDate: string | dayjs.Dayjs, onMountScroll = false) => {
      const currDayDiv = document.getElementById(id + '-' + dayjs(targetDate).format('YYYY-MMM-D'))
      if (!currDayDiv || !dateBar.current) return

      const colWidth = currDayDiv.offsetWidth
      const containerWidth = dateBar.current.offsetWidth
      const centerOfCurrDayDiv = currDayDiv.offsetLeft - containerWidth / 2 + colWidth / 2

      dateBar.current.scrollTo({
        left: centerOfCurrDayDiv,
        behavior: onMountScroll ? 'auto' : 'smooth',
      })
    },
    [dateBar, id]
  )

  useEffect(() => {
    scrollToDate(dayjs(), true)
  }, [scrollToDate, pathname])

  return (
    <Container className={`gantt-chart dark:text-white ${className}`}>
      {/* Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <h3 className="min-w-max text-lg font-bold">{chartTitle}</h3>

        <label className="flex items-center">
          <span className="mr-1 text-sm">Zoom:</span>
          <input
            type="range"
            min="8"
            max="40"
            value={dateWidth}
            onChange={(e) => setDateWidth(parseInt(e.target.value))}
            step="1"
          />
        </label>
      </div>

      {/* Chart */}
      <div
        style={{ maxHeight: chartHeight }}
        className="thin-scrollbar rounded-md border border-dark bg-gray-50 dark:bg-slate-700"
      >
        <div className="flex items-stretch">
          {/* Left Side */}
          <div ref={leftSide} className="min-w-[70px] max-w-full flex-1">
            <div className="sticky top-0 z-20 h-12 border-b-2 border-dark bg-gray-50 p-2 dark:bg-slate-700">
              <button className="white-btn rounded py-1 px-2 text-sm" onClick={() => scrollToDate(dayjs(), false)}>
                Today
              </button>
            </div>

            {/* Titles */}
            <div className="overflow-hidden">
              {itemChildrenMap.get('root')?.map((item, i) => renderItemTitle(item, i))}
            </div>
          </div>

          {/* Resizer */}
          <div
            ref={resizer}
            onMouseDown={mouseDownHandler}
            className="min-w-[2px] cursor-col-resize bg-slate-400 dark:bg-slate-900"
          />

          {/* Right Side */}
          <div ref={rightSide} className="w-[75%] max-w-[calc(100%-75px)]">
            {/* Date Bar */}
            <div
              ref={dateBar}
              className="sticky top-0 z-20 h-12 overflow-x-hidden border-b-2 border-dark bg-gray-50 dark:bg-slate-700"
            >
              <div className="inline-flex h-full items-end">{renderDates()}</div>
            </div>

            {/* Bars */}
            <div ref={barsContainer} hideScrollbars={false} className="thin-scrollbar relative flex max-w-max flex-col">
              {renderTodayBar()}

              {itemChildrenMap.get('root')?.map((item) => renderItemBar(item))}
            </div>
          </div>
        </div>
      </div>

      {legend && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 text-gray-700 dark:text-gray-200">
          {legend.map((item) => (
            <div key={item.color} className="flex items-center text-sm">
              {item.label}
              <span className="ml-1 block h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default Gantt

const Container = styled.div`
  input[type='range'] {
    display: block;
    -webkit-appearance: none;
    appearance: none;
    background-color: #ccc;
    width: 150px;
    height: 5px;
    border-radius: 5px;
    margin: 0 auto;
    outline: 0;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #3350e8;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: 0.2s ease;
  }
  input[type='range']::-webkit-slider-thumb:hover {
    border: 1px solid white;
  }
`

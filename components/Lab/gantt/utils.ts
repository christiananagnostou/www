import dayjs from 'dayjs'
import type { ItemProps } from '.'

/**
 *
 * @param {Date | string} startDate
 * @param {Date | string} endDate
 * @returns Number of days between start date and end date
 */
export const getDayDiff = (startDate: string | dayjs.Dayjs, endDate: string | dayjs.Dayjs) => {
  return Math.abs(dayjs(startDate).diff(endDate, 'days'))
}

/**
 *
 * @returns Min and Max dates from items +/- 7 days
 */
export const getItemsDateRange = (items: ItemProps[]) => {
  const startDates: dayjs.Dayjs[] = []
  const endDates: dayjs.Dayjs[] = []

  items.forEach((item) => {
    const { startDate, endDate } = item
    startDates.push(dayjs(startDate))
    endDates.push(dayjs(endDate))
  })

  // max and min day +/- 7 days
  const firstDate = dayjs.min(startDates.filter((date) => date.isValid()))?.subtract(7, 'day') || dayjs()
  const lastDate = dayjs.max(endDates.filter((date) => date.isValid()))?.add(7, 'day') || dayjs()

  return { firstDate, lastDate }
}

/**
 *
 * @returns The number of days currently shown on the chart
 */
export const getNumDaysShown = (itemsDateRange: { firstDate: dayjs.Dayjs; lastDate: dayjs.Dayjs }) => {
  const { firstDate, lastDate } = itemsDateRange
  const daysBetween = getDayDiff(firstDate, lastDate)
  return daysBetween + 1 // +1 to include last date
}

/**
 *
 * @returns the children for any given item (passing 'root' returns all tasks without a parent)
 */
export const getItemsChildrenMap = (items: ItemProps[]) => {
  const childrenMap = new Map<string | number, ItemProps[]>()
  items.forEach((item) =>
    childrenMap.set(item.parentId || 'root', [...(childrenMap.get(item.parentId || 'root') || []), item])
  )
  return childrenMap
}

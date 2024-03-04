import { BarHeight } from './DailyCalendar'

/**
 * @param date Date object
 * @param format 12-hour or 24-hour clock format
 */
export const dateToTime = (date: Date, format: 12 | 24 = 24) => {
  const mins = date.getMinutes()
  let hours = date.getHours()
  const suffix = format === 12 ? (hours >= 12 ? ' PM' : ' AM') : ''
  if (format === 12) hours = (hours > 12 ? hours - 12 : hours) || 12
  return `${hours}${mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ''}` + suffix
}

/**
 * @param time formatted as 00:00 on a 24-hour clock. For example: 01:42 or 17:24
 */
export const timeToPx = (time: string) => {
  const [hours, mins] = time.split(':')
  const hoursPx = parseInt(hours) * BarHeight
  const minsPx = (parseInt(mins || '0') / 60) * BarHeight
  return hoursPx + minsPx
}

export function getRandomColor(min = 150) {
  const random = (): number => {
    const r = Math.floor(Math.random() * 256)
    return r < min ? random() : r
  }

  return `rgb(${random()},${random()},${random()})`
}

export function formatTime(hours: number) {
  if (hours === 0) return ''

  const suffix = hours >= 12 ? ' PM' : ' AM'
  hours = hours > 12 ? hours - 12 : hours

  return hours + suffix
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000)
}

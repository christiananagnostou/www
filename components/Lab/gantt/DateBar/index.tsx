import dayjs from 'dayjs'
import { DateBarContainer, DateButton, DateLabel, DaySpan } from './styles'

interface DatesProps {
  itemsDateRange: { lastDate: dayjs.Dayjs }
  numDaysShown: number
  dateWidth: number
  scrollToDate: (date: string, behavior: ScrollBehavior) => void
}

const Today = dayjs().format('YYYY-MMM-D')

const DateBar = ({ itemsDateRange, numDaysShown, dateWidth, scrollToDate }: DatesProps) => {
  const getOpacity = (day: string) => {
    let interval = 2 // Number of days until another date is shown on low zoom
    dateWidth > 24 && (interval = 1)
    dateWidth < 14 && (interval = 4)

    const currentDate = dayjs().date()

    if ((parseInt(day) + (interval - (currentDate % interval))) % interval !== 0) return 0
    return 1
  }

  const { lastDate } = itemsDateRange
  const dates = Array(numDaysShown)
    .fill(null)
    .map((_, i) => dayjs(lastDate).subtract(i, 'day').format('YYYY-MMM-D'))
    .reverse()

  return (
    <DateBarContainer>
      {dates.map((date) => {
        const [_, month, day] = date.split('-')
        const isToday = Today === date

        return (
          <DateButton key={date} id={date} onClick={() => scrollToDate(date, 'smooth')} $dateWidth={dateWidth}>
            <DateLabel $dateWidth={dateWidth}>
              {day === '1' && <span>{month}</span>}

              <DaySpan $isToday={isToday} $opacity={getOpacity(day)}>
                {day}
              </DaySpan>
            </DateLabel>
          </DateButton>
        )
      })}
    </DateBarContainer>
  )
}

export default DateBar

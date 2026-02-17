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
    if (dateWidth > 24) {
      interval = 1
    }
    if (dateWidth < 14) {
      interval = 4
    }

    const currentDate = dayjs().date()

    if ((parseInt(day, 10) + (interval - (currentDate % interval))) % interval !== 0) return 0
    return 1
  }

  const { lastDate } = itemsDateRange
  const dates = Array.from({ length: numDaysShown }, (_, i) =>
    dayjs(lastDate).subtract(i, 'day').format('YYYY-MMM-D')
  ).toReversed()

  return (
    <DateBarContainer>
      {dates.map((date) => {
        const [_, month, day] = date.split('-')
        const isToday = Today === date

        return (
          <DateButton key={date} $dateWidth={dateWidth} id={date} onClick={() => scrollToDate(date, 'smooth')}>
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

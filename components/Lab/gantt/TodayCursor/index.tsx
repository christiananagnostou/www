import dayjs from 'dayjs'
import { getDayDiff } from '../utils'
import { TodayCursorStyle } from './styles'

interface Props {
  dateWidth: number
  itemsDateRange: { firstDate: dayjs.Dayjs; lastDate: dayjs.Dayjs }
}

const TodayCursor = ({ dateWidth, itemsDateRange }: Props) => {
  const { firstDate } = itemsDateRange
  const offsetDaysStart = getDayDiff(firstDate, dayjs())
  const barWidth = 2
  return <TodayCursorStyle $dateWidth={dateWidth} $offsetDays={offsetDaysStart} $width={barWidth} />
}

export default TodayCursor

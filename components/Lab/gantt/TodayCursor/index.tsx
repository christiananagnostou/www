import dayjs from 'dayjs'
import { getDayDiff } from '../utils'
import { TodayCursorStyle } from './styles'

type Props = {
  dateWidth: number
  itemsDateRange: { firstDate: dayjs.Dayjs; lastDate: dayjs.Dayjs }
}

const TodayCursor = ({ dateWidth, itemsDateRange }: Props) => {
  const { firstDate } = itemsDateRange
  const offsetDaysStart = getDayDiff(firstDate, dayjs())
  const barWidth = 2
  return <TodayCursorStyle width={barWidth} offsetDays={offsetDaysStart} dateWidth={dateWidth} />
}

export default TodayCursor

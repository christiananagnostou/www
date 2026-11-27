import dayjs from 'dayjs'

import { getDayDiff } from '../utils'

import styles from './TodayCursor.module.css'

interface Props {
  dateWidth: number
  itemsDateRange: { firstDate: dayjs.Dayjs; lastDate: dayjs.Dayjs }
}

const TodayCursor = ({ dateWidth, itemsDateRange }: Props) => {
  const { firstDate } = itemsDateRange
  const offsetDaysStart = getDayDiff(firstDate, dayjs())
  const barWidth = 2
  return (
    <div
      style={{ left: offsetDaysStart * dateWidth + dateWidth / 2 - barWidth / 2, width: barWidth }}
      className={styles.todayCursor}
    />
  )
}

export default TodayCursor

import dayjs from 'dayjs'

import type { ItemProps } from '..'
import { RowHeight } from '..'
import { getDayDiff } from '../utils'

import styles from './ItemBar.module.css'

const MIN_INLINE_LABEL_WIDTH = 100

interface RenderItemBarProps {
  item: ItemProps
  dateWidth: number
  itemsDateRange: { firstDate: dayjs.Dayjs }
  itemsChildrenMap: Map<ItemProps['id'], ItemProps[]>
  handleRowMouseOver: (id: string | number) => void
}

const ItemBar = (props: RenderItemBarProps) => {
  const { item, dateWidth, itemsDateRange, itemsChildrenMap, handleRowMouseOver } = props
  const { startDate, endDate } = item
  const daysBetween = getDayDiff(startDate, endDate)

  const { firstDate } = itemsDateRange
  const offsetDaysStart = getDayDiff(firstDate, endDate)

  const minWidth = dateWidth / 3
  const barWidth = daysBetween * dateWidth
  const startsAndEndsToday = dayjs(startDate).isSame(endDate, 'day') && dayjs(endDate).isSame(dayjs(), 'day')
  const showTooltip = barWidth <= MIN_INLINE_LABEL_WIDTH

  return (
    <>
      <div
        style={{ height: RowHeight }}
        className={`${styles.itemBarContainer} gantt-bar`}
        data-item-id={item.id}
        onMouseEnter={() => handleRowMouseOver(item.id)}
      >
        <div style={{ marginRight: dateWidth * 7 }}>
          <div
            style={{
              backgroundColor: item.barColor || '#3350E8',
              height: RowHeight / 2,
              marginLeft:
                offsetDaysStart * dateWidth - (barWidth || (startsAndEndsToday ? minWidth : 0)) + dateWidth / 2,
              width: barWidth || minWidth,
            }}
            className={styles.bar}
          >
            {item.barLabel &&
              (showTooltip ? (
                <span className={styles.tooltip}>{item.barLabel}</span>
              ) : (
                <span className={styles.barLabel}>{item.barLabel}</span>
              ))}
            <span className={styles.startLabel}>{dayjs(item.startDate).format('MMM D')}</span>
            <span className={styles.endLabel}>{dayjs(item.endDate).format('MMM D')}</span>
          </div>
        </div>
      </div>

      {itemsChildrenMap.get(item.id)?.map((child) => (
        <ItemBar key={`${child.id}_bar-fragment`} {...props} item={child} />
      ))}
    </>
  )
}

export default ItemBar

import dayjs from 'dayjs'
import type { ItemProps } from '..'
import { RowHeight } from '..'
import { getDayDiff } from '../utils'
import { Bar, BarLabel, BarWrap, EndLabel, ItemBarContainer, StartLabel } from './styles'

interface RenderItemBarProps {
  item: ItemProps
  dateWidth: number
  numDaysShown: number
  itemsDateRange: { firstDate: dayjs.Dayjs }
  itemsChildrenMap: Map<ItemProps['id'], ItemProps[]>
  handleRowMouseOver: (id: string | number) => void
}

const ItemBar = (props: RenderItemBarProps) => {
  const { item, dateWidth, numDaysShown, itemsDateRange, itemsChildrenMap, handleRowMouseOver } = props
  const { startDate, endDate } = item
  const daysBetween = getDayDiff(startDate, endDate)

  const { firstDate } = itemsDateRange
  const offsetDaysStart = getDayDiff(firstDate, endDate)

  const minWidth = dateWidth / 3
  const barWidth = daysBetween * dateWidth
  const startsAndEndsToday = dayjs(startDate).isSame(endDate, 'day') && dayjs(endDate).isSame(dayjs(), 'day')

  return (
    <>
      <ItemBarContainer
        className="gantt-bar"
        data-item-id={item.id}
        height={RowHeight}
        onMouseEnter={() => handleRowMouseOver(item.id)}
      >
        <BarWrap rightMargin={dateWidth * 7}>
          <Bar
            backgroundColor={item.barColor || '#3350E8'}
            height={RowHeight / 2}
            marginLeft={offsetDaysStart * dateWidth - (barWidth || (startsAndEndsToday ? minWidth : 0)) + dateWidth / 2}
            width={barWidth || minWidth}
          >
            {item.barLabel && barWidth > 100 ? <BarLabel>{item.barLabel}</BarLabel> : null}
            <StartLabel>{dayjs(item.startDate).format('MMM D')}</StartLabel>
            <EndLabel>{dayjs(item.endDate).format('MMM D')}</EndLabel>
          </Bar>
        </BarWrap>
      </ItemBarContainer>

      {itemsChildrenMap.get(item.id)?.map((child) => (
        <ItemBar key={`${child.id}_bar-fragment`} {...props} item={child} />
      ))}
    </>
  )
}

export default ItemBar

import dayjs from 'dayjs'
import type { ItemProps } from '..'
import { RowHeight } from '..'
import ChildArrow from '../ChildArrow'
import { TitleButton, TitleSpan } from './styles'

interface ItemTitleProps {
  item: ItemProps
  idx: number
  level: number
  itemsChildrenMap: Map<ItemProps['id'], ItemProps[]>
  handleRowMouseOver: (id: ItemProps['id']) => void
  scrollToDate: (targetDate: string | dayjs.Dayjs, behavior: ScrollOptions['behavior']) => void
}

const ItemTitle = ({ item, idx, level, itemsChildrenMap, handleRowMouseOver, scrollToDate }: ItemTitleProps) => {
  const children = itemsChildrenMap.get(item.id)

  // Count children of previous sibling
  const parent = itemsChildrenMap.get(item.parentId || 'root') || []
  const prevSibling = parent[idx - 1]
  let prevChildCount = 0

  const countChildren = (itemId: ItemProps['id'], count = 0) => {
    const childs = itemsChildrenMap.get(itemId)
    childs?.forEach((child) => (count += countChildren(child.id)))
    return count + (childs?.length || 0)
  }

  if (prevSibling && item.parentId) {
    prevChildCount = countChildren(prevSibling.id)
  }

  const paddingLeft = level * (level > 1 ? 12 : 8)

  return (
    <>
      <TitleButton
        $paddingLeft={paddingLeft}
        className="gantt-title"
        data-item-id={item.id}
        height={RowHeight}
        onClick={() => scrollToDate(item.startDate || dayjs().format('YYYY-MM-DD'), 'smooth')}
        onMouseEnter={() => handleRowMouseOver(item.id)}
        onMouseLeave={() => handleRowMouseOver(-1)}
      >
        {item.parentId ? (
          <span>
            <ChildArrow
              color={item.barColor || 'transparent'}
              height={RowHeight * (prevChildCount + 1) * (idx == 0 ? 1.6 : 2.225)}
              rounded={idx == 0}
              width={16}
            />
          </span>
        ) : null}
        <TitleSpan>{item.title}</TitleSpan>
      </TitleButton>

      {children?.map((child, i) => (
        <ItemTitle
          key={`${child.id}_title`}
          handleRowMouseOver={handleRowMouseOver}
          idx={i}
          item={child}
          itemsChildrenMap={itemsChildrenMap}
          level={level + 1}
          scrollToDate={scrollToDate}
        />
      ))}
    </>
  )
}

export default ItemTitle

import dayjs from 'dayjs'
import React from 'react'
import { ItemProps, RowHeight } from '..'
import ChildArrow from '../ChildArrow'
import { ArrowWrap, ConnectorLine, TitleButton, TitleSpan } from './styles'

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
    <React.Fragment>
      <TitleButton
        data-item-id={item.id}
        className="gantt-title"
        onMouseEnter={() => handleRowMouseOver(item.id)}
        onMouseLeave={() => handleRowMouseOver(-1)}
        onClick={() => scrollToDate(item.startDate || dayjs().format('YYYY-MM-DD'), 'smooth')}
        paddingLeft={paddingLeft}
        height={RowHeight}
      >
        {item.parentId && (
          <span style={{ position: 'relative', zIndex: 0 }}>
            <ConnectorLine
              height={idx > 0 ? (prevChildCount ? prevChildCount + 1 : 1) * 40 - 2 : 27}
              top={idx > 0 ? -(prevChildCount ? prevChildCount + 1 : 1) * 40 + 10 : -17}
              background={item.barColor || 'white'}
            />
            <ArrowWrap color={item.barColor || 'transparent'}>
              <ChildArrow height={16} width={16} />
            </ArrowWrap>
          </span>
        )}
        <TitleSpan>{item.title}</TitleSpan>
      </TitleButton>

      {children?.map((child, i) => (
        <ItemTitle
          key={child.id + '_title'}
          item={child}
          idx={i}
          level={level + 1}
          itemsChildrenMap={itemsChildrenMap}
          handleRowMouseOver={handleRowMouseOver}
          scrollToDate={scrollToDate}
        />
      ))}
    </React.Fragment>
  )
}

export default ItemTitle

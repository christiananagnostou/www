import styled from 'styled-components'

export const DateBarContainer = styled.div`
  display: inline-flex;
  height: 100%;
  height: var(--date-bar-height);
  border-bottom: 1px solid var(--border-color);
`

export const DateButton = styled.button<{ $dateWidth: number }>`
  position: relative;
  height: 100%;
  font-size: 0.7rem;
  width: ${({ $dateWidth }) => $dateWidth + 'px'};
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
`

export const DateLabel = styled.div<{ $dateWidth: number }>`
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  left: ${({ $dateWidth }) => $dateWidth / 2 + 'px'};
  padding-bottom: 0.5rem;
`

export const DaySpan = styled.span<{ $isToday: boolean; $opacity: number }>`
  display: grid;
  place-items: center;
  opacity: ${({ $opacity }) => $opacity};
  color: ${({ $isToday }) => ($isToday ? 'white' : 'inherit')};
  position: relative;

  /* Today Circle */
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 9999px;
    background-color: var(--accent-color);
    display: ${({ $isToday }) => ($isToday ? 'block' : 'none')};
  }
`

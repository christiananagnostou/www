import styled from 'styled-components'

export const DateBarContainer = styled.div`
  display: inline-flex;
  height: 100%;
  align-items: end;
`

export const DateButton = styled.button<{ dateWidth: number }>`
  position: relative;
  height: 100%;
  font-size: 0.7rem;
  width: ${({ dateWidth }) => `${dateWidth}px`};
  background: transparent;
  border: none;
  color: white;
`

export const DateLabel = styled.div<{ dateWidth: number }>`
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  left: ${({ dateWidth }) => `${dateWidth / 2}px`};
  padding-bottom: 0.5rem;
`

export const DaySpan = styled.span<{ isToday: boolean; opacity: number }>`
  display: grid;
  place-items: center;
  opacity: ${({ opacity }) => opacity};
  color: ${({ isToday }) => (isToday ? 'white' : 'inherit')};
`

export const TodayIndicator = styled.span`
  position: absolute;
  z-index: -1;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  background-color: var(--accent-color);
`

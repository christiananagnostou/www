import styled from 'styled-components'

export const DateBarContainer = styled.div`
  display: inline-flex;
  height: 100%;
  height: var(--date-bar-height);
  border-bottom: 1px solid var(--border-color);
`

export const DateButton = styled.button<{ dateWidth: number }>`
  position: relative;
  width: ${({ dateWidth }) => `${dateWidth}px`};
  height: 100%;
  border: none;
  background: transparent;
  font-size: 0.7rem;
  color: inherit;
  cursor: pointer;
`

export const DateLabel = styled.div<{ dateWidth: number }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  padding-bottom: 0.5rem;
  transform: translateX(-50%);
`

export const DaySpan = styled.span<{ isToday: boolean; opacity: number }>`
  position: relative;
  display: grid;
  opacity: ${({ opacity }) => opacity};
  color: ${({ isToday }) => (isToday ? 'white' : 'inherit')};
  place-items: center;

  /* Today Circle */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    display: ${({ isToday }) => (isToday ? 'block' : 'none')};
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    background-color: var(--accent-color);
    transform: translate(-50%, -50%);
  }
`

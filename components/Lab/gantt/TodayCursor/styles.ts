import styled from 'styled-components'

export const TodayCursorStyle = styled.div<{
  width: number
  offsetDays: number
  dateWidth: number
}>`
  position: absolute;
  z-index: 20;
  height: calc(100% - var(--date-bar-height) + 0.5rem);
  background-color: var(--accent-color);
  width: ${({ width }) => width}px;
  left: ${({ offsetDays, dateWidth, width }) => offsetDays * dateWidth + dateWidth / 2 - width / 2}px;
  bottom: 0;
`

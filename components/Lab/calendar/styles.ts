import styled from 'styled-components'

export const HOUR_BAR_HEIGHT = 60

export const DailyCalendarStyle = styled.div`
  --border-color: var(--accent);
  --bg: var(--body-bg);
  --row-grid: 3rem 1fr;
  --blue: #1b72e8;
  --red: #fe2968;
  --resize-bar-bg: var(--bg);
  --header-curr-date-color: #ffffff;
  --daily-event-text-color: #cccccc;
  --time-bar-width: 3.75rem;
  --hour-bar-height: ${HOUR_BAR_HEIGHT}px;
  position: relative;
  width: 100%;

  max-width: calc(50% - 0.5rem);
  margin: auto;

  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg);
  user-select: none;
  overflow: hidden;

  @media (width <= 768px) {
    max-width: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(var(--time-bar-width) - 1px);
    z-index: 1;
    display: block;
    width: 1px;
    height: calc(500px + 15px);
    background: var(--border-color);
  }
`

export const StickyHeader = styled.div`
  display: grid;
  align-items: end;
  grid-template-columns: var(--row-grid);
  border-bottom: 1px solid var(--border-color);
`

export const Timezone = styled.span`
  position: relative;
  padding-bottom: 0.25rem;
  font-size: 8px;
  text-align: center;
`

export const DateWrap = styled.div`
  display: grid;
  width: min-content;
  padding: 0.25rem 1.25rem;
  place-items: center;
`

export const CurrentDay = styled.div`
  margin-bottom: 2px;
  font-weight: 600;
  font-size: 11px;
  color: var(--blue);
  text-transform: uppercase;
`

export const CurrentDate = styled.div`
  display: grid;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background: var(--blue);
  font-size: 18px;
  color: var(--header-curr-date-color);
  place-items: center;
`

export const HourListWrap = styled.div`
  position: relative;
  height: 500px;
  overflow-y: auto;
  scroll-padding-top: 50%;
`

export const HourBarWrap = styled.div``

export const HourBar = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: var(--row-grid);
  max-width: 100%;
  height: var(--hour-bar-height);
  &:not(:last-child)::after {
    content: '';
    width: 100%;
    border-bottom: 1px solid var(--border-color);
  }
`

export const HourBarTime = styled.span`
  position: relative;
  display: block;
  height: 12px;
  padding-left: 0.5rem;
  font-size: 12px;
  line-height: 12px;
  user-select: none;
  transform: translateY(-50%);
`

export const EventWrap = styled.div`
  position: relative;
  left: var(--time-bar-width);
  width: calc(100% - var(--time-bar-width));
`

export const DailyEventContainer = styled.div`
  position: absolute;
  z-index: 1;
  border-radius: 4px;
  background: var(--red);
  transition:
    top 50ms ease-in-out,
    height 50ms ease-in-out,
    width 150ms ease-in-out,
    left 150ms ease-in-out;

  &.selected {
    z-index: 4;
    box-shadow: 0 0 0 1px var(--border-color);
  }
`

export const DailyEventRelative = styled.div`
  position: relative;
  height: 100%;
  padding: 0.05rem 0.5rem;
  font-weight: bold;
  font-size: 10px;
`

export const DailyEventInner = styled.div`
  --text: var(--daily-event-text-color);
`

export const TimeRange = styled.p``

export const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: var(--text);
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.5;
  }
`

export const ResizeBar = styled.div`
  --height: 6px;
  position: absolute;
  right: 0;
  left: 0;
  display: block;
  width: 40px;
  height: var(--height);
  margin: auto;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--resize-bar-bg);
  cursor: ns-resize;
`

export const CurrentTimeBar = styled.div`
  position: absolute;
  left: var(--time-bar-width);
  z-index: 2;
  width: calc(100% - var(--time-bar-width));
  height: 2px;
  background: var(--red);
  pointer-events: none;
  &::after {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 10px;
    background: var(--red);
    transform: translate(-50%, calc(-50% + 1px));
  }
`

import styled from 'styled-components'

export const BarHeight = 60

export const DailyCalendarStyle = styled.div`
  --border-color: var(--accent);
  --row-grid: 3rem 1fr;
  --blue: #1b72e8;
  --red: #fe2968;
  --resize-event-bg: var(--text);
  --background: var(--body-bg);
  --header-curr-date-color: #fff;
  --daily-event-text-color: #fff;
  --time-bar-width: 3.75rem;
  --hour-bar-height: ${BarHeight}px;

  position: relative;
  width: 100%;
  margin: auto;
  overflow-x: hidden;
  user-select: none;

  &::after {
    content: '';
    display: block;
    width: 1px;
    position: absolute;
    bottom: 0;
    left: calc(var(--time-bar-width) - 1px);
    background: var(--border-color);
    height: calc(500px + 15px);
    z-index: 1;
  }
`

export const StickyHeader = styled.div`
  max-width: 100%;
  background: var(--background);
  border-bottom: 1px solid var(--border-color);
  display: grid;
  grid-template-columns: var(--row-grid);
  align-items: end;
`

export const Timezone = styled.span`
  font-size: 8px;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  position: relative;
`

export const DateWrap = styled.div`
  padding: 0.25rem 1.25rem;
  display: grid;
  place-items: center;
  width: min-content;
`

export const CurrentDay = styled.div`
  color: var(--blue);
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 2px;
`

export const CurrentDate = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: var(--blue);
  display: grid;
  place-items: center;
  font-size: 18px;
  color: var(--header-curr-date-color);
`

export const HourListWrap = styled.div`
  position: relative;
  height: 500px;
  overflow-y: auto;
`

export const HourBar = styled.div`
  height: var(--hour-bar-height);
  max-width: 100%;
  display: grid;
  position: relative;
  grid-template-columns: var(--row-grid);
  &:not(:last-child)::after {
    content: '';
    width: 100%;
    border-bottom: 1px solid var(--border-color);
  }
`

export const HourBarTime = styled.span`
  display: block;
  transform: translateY(-50%);
  height: 12px;
  font-size: 12px;
  line-height: 12px;
  padding-left: 0.5rem;
  background: var(--background);
  user-select: none;
  position: relative;
`

export const DailyEventContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: calc(100% - var(--time-bar-width));
  left: var(--time-bar-width);
  background: var(--red);
  border-radius: 4px;

  &.selected {
    z-index: 4;
  }
`

export const DailyEventRelative = styled.div`
  position: relative;
  height: 100%;
  padding: 0.1rem 0.5rem;
  font-size: 12px;
`

export const DailyEventInner = styled.div`
  --text: var(--daily-event-text-color);
`

export const TimeRange = styled.p``

export const DeleteButton = styled.button`
  background: none;
  padding: 0;
  margin: 0;
  border: none;
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  transition: opacity 0.2s ease-in-out;
  color: var(--text);
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

export const ResizeEvent = styled.div`
  --height: 8px;
  background: var(--resize-event-bg);
  height: var(--height);
  width: 40px;
  border-radius: 10px;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  cursor: ns-resize;
`

export const CurrentTimeBar = styled.div`
  background: var(--red);
  width: 100%;
  height: 2px;
  position: absolute;
  z-index: 2;
  width: calc(100% - var(--time-bar-width));
  left: var(--time-bar-width);
  pointer-events: none;
  &::after {
    content: '';
    height: 12px;
    width: 12px;
    display: block;
    transform: translate(-50%, calc(-50% + 1px));
    border-radius: 10px;
    background: var(--red);
  }
`

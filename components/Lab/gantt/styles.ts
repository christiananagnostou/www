import styled from 'styled-components'

export const GanttContainer = styled.div`
  width: 100%;

  --accent-color: #1b72e8;
  --border-color: var(--accent);
  --bg: var(--body-bg);
  --left-side-min-width: 0.25rem;
  --right-side-min-width: 0.25rem;
  --date-bar-height: 2.5rem;
`

export const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const Title = styled.p`
  min-width: max-content;
  font-size: 1rem;
`

export const Label = styled.label`
  display: flex;
  align-items: center;
`

export const ZoomTitle = styled.span`
  margin-right: 0.5rem;
  font-weight: 300;
  font-size: 0.875rem;
`

export const ZoomInput = styled.input`
  --input-height: 4px;
  --input-width: 150px;
  --input-thumb-size: 15px;

  display: block;
  width: var(--input-width);
  height: var(--input-height);
  margin: 0 auto;
  border-radius: 5px;
  outline: 0;
  background-color: var(--border-color);
  appearance: none;

  &::-webkit-slider-thumb {
    width: var(--input-thumb-size);
    height: var(--input-thumb-size);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    background-color: var(--accent-color);
    cursor: pointer;
    appearance: none;
    transition: 0.2s ease;
  }
  &::-webkit-slider-thumb:hover,
  &:focus::-webkit-slider-thumb {
    scale: 1.3;
  }
`

export const Chart = styled.div`
  display: flex;
  max-width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--bg);
  overflow: hidden;
`

export const LeftSide = styled.div`
  flex: 1;
  min-width: var(--left-side-min-width);
  user-select: none;
  overflow: hidden;
`

export const ScrollToTodayBtn = styled.button`
  display: block;
  width: 100%;
  height: var(--date-bar-height);
  padding: 0 0.5rem;
  border: none;
  border-bottom: 1px solid var(--border-color);
  background: transparent;
  text-align: left;
  color: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;

  &:hover,
  &:focus {
    background-color: rgb(0 0 0 / 10%);
  }
`

export const Resizer = styled.div`
  --resizer-width: 9px;
  z-index: 25;
  width: var(--resizer-width);
  margin: 0 calc(-1 * ((var(--resizer-width) - 1px) / 2));
  cursor: col-resize;

  &:active {
    box-shadow: 0 0 0 1px var(--accent-color);
  }

  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    margin: auto;
    background-color: var(--border-color);
  }

  @media (width <= 768px) {
    --resizer-width: 13px;
  }
`

export const RightSide = styled.div`
  position: relative;
  width: 75%;
  min-width: var(--right-side-min-width);
  max-width: calc(100% - var(--left-side-min-width));
  overflow: auto hidden;
  overscroll-behavior-x: none;
`

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
`

export const LegendColor = styled.span`
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.25rem;
  border-radius: 9999px;
`

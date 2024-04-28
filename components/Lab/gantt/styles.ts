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
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

export const Title = styled.p`
  min-width: max-content;
  font-size: 1rem;
  font-weight: bold;
`

export const Label = styled.label`
  display: flex;
  align-items: center;
`

export const ZoomTitle = styled.span`
  margin-right: 0.5rem;
  font-size: 0.875rem;
`

export const ZoomInput = styled.input`
  --input-height: 4px;
  --input-width: 150px;
  --input-thumb-size: 15px;

  display: block;
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--border-color);
  width: var(--input-width);
  height: var(--input-height);
  border-radius: 5px;
  margin: 0 auto;
  outline: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--accent-color);
    width: var(--input-thumb-size);
    height: var(--input-thumb-size);
    border-radius: 50%;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: 0.2s ease;
  }
  &::-webkit-slider-thumb:hover,
  &:focus::-webkit-slider-thumb {
    scale: 1.3;
  }
`

export const Chart = styled.div`
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
  max-width: 100%;
  background-color: var(--bg);
  overflow: hidden;
  display: flex;
`

export const LeftSide = styled.div`
  min-width: var(--left-side-min-width);
  flex: 1;
  user-select: none;
  overflow: hidden;
`

export const ScrollToTodayBtn = styled.button`
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  height: var(--date-bar-height);
  border-bottom: 1px solid var(--border-color);
  padding: 0 0.5rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

export const Resizer = styled.div`
  cursor: col-resize;
  background-color: var(--border-color);
  padding: 1px;
  z-index: 25;
`

export const RightSide = styled.div`
  width: 75%;
  max-width: calc(100% - var(--left-side-min-width));
  min-width: var(--right-side-min-width);
  position: relative;
  overflow-x: auto;
  overscroll-behavior-x: none;
`

export const Legend = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
`

export const LegendColor = styled.span`
  display: block;
  margin-right: 0.25rem;
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 9999px;
`

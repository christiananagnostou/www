import styled from 'styled-components'

export const GanttContainer = styled.div`
  width: 100%;

  --accent-color: #1b72e8;
  --border-color: var(--accent);
  --bg: var(--body-bg);
  --left-side-min-width: 0.25rem;
  --right-side-min-width: 0.25rem;
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
`

export const LeftSide = styled.div`
  min-width: var(--left-side-min-width);
  flex: 1;
  user-select: none;
`

export const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  height: 3rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg);
  padding-bottom: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge, and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
`

export const BarsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
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

export const TodayBar = styled.div<{
  width: number
  offsetDays: number
  dateWidth: number
}>`
  position: absolute;
  z-index: 10;
  height: 100%;
  background-color: var(--accent-color);
  width: ${({ width }) => width}px;
  left: ${({ offsetDays, dateWidth, width }) => offsetDays * dateWidth + dateWidth / 2 - width / 2}px;
`

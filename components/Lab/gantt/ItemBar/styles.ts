import styled from 'styled-components'

export const ItemBarContainer = styled.div<{ $height: number }>`
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: ${({ $height }) => `${$height}px`};
  user-select: none;

  &.hovered {
    background: rgb(0 0 0 / 10%);
  }
`

export const BarWrap = styled.div<{ $rightMargin: number }>`
  margin-right: ${({ $rightMargin }) => `${$rightMargin}px`};
`

export const Bar = styled.div<{ $width: number; $height: number; $marginLeft: number; $backgroundColor: string }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  margin-left: ${({ $marginLeft }) => `${$marginLeft}px`};
  border-radius: 4px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  font-size: 0.65rem;
`

export const BarLabel = styled.span`
  position: sticky;
  left: 0;
  width: 100%;
  margin-left: 0.25rem;
  color: #000000;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const StartLabel = styled.span`
  position: absolute;
  right: calc(100% + 0.3rem);
  z-index: 15;
  min-width: max-content;
  opacity: 0.5;
`

export const EndLabel = styled.span`
  position: absolute;
  left: calc(100% + 0.3rem);
  z-index: 15;
  min-width: max-content;
  opacity: 0.5;
`

export const Tooltip = styled.span<{ $height: number }>`
  position: absolute;
  top: -${({ $height }) => $height / 2}px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark-bg, rgba(30, 30, 30, 0.95));
  color: var(--text);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 20;

  ${Bar}:hover & {
    opacity: 1;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid var(--dark-bg, rgba(30, 30, 30, 0.95));
  }
`

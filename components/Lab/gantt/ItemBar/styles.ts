import styled from 'styled-components'

export const ItemBarContainer = styled.div<{ $height: number }>`
  display: inline-flex;
  user-select: none;
  align-items: center;
  width: 100%;
  height: ${({ $height }) => `${$height}px`};

  &.hovered {
    background: rgba(0, 0, 0, 0.1);
  }
`

export const BarWrap = styled.div<{ $rightMargin: number }>`
  margin-right: ${({ $rightMargin }) => `${$rightMargin}px`};
`

export const Bar = styled.div<{ $width: number; $height: number; $marginLeft: number; $backgroundColor: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  font-size: 0.65rem;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  margin-left: ${({ $marginLeft }) => `${$marginLeft}px`};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`

export const BarLabel = styled.span`
  position: sticky;
  left: 0;
  margin-left: 0.25rem;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000000;
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

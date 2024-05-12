import styled from 'styled-components'

export const TitleButton = styled.button<{ paddingLeft: number; height: number }>`
  display: flex;
  width: 100%;
  align-items: center;
  text-align: left;
  padding-right: 0.25rem;
  padding-left: calc(${({ paddingLeft }) => `${paddingLeft}px`} + 0.25rem);
  height: ${({ height }) => `${height}px`};
  background: transparent;
  color: inherit;
  border: none;
  cursor: pointer;

  &.hovered {
    background: rgba(0, 0, 0, 0.1);
  }
`

export const TitleSpan = styled.span`
  padding-left: 0.25rem;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

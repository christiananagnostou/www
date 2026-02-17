import styled from 'styled-components'

export const TitleButton = styled.button<{ $paddingLeft: number; $height: number }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${({ $height }) => `${$height}px`};
  padding-right: 0.25rem;
  padding-left: calc(${({ $paddingLeft }) => `${$paddingLeft}px`} + 0.25rem);
  border: none;
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;

  &.hovered {
    background: rgb(0 0 0 / 10%);
  }
`

export const TitleSpan = styled.span`
  padding-left: 0.25rem;
  font-weight: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

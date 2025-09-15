import styled from 'styled-components'

// excess height to improve interactive area / accessibility
const height = '16px'
const thumbHeight = 16
const trackHeight = '4px'

// colours
const upperColor = 'var(--accent)'
const lowerColor = 'var(--accent)'
const thumbColor = 'var(--text)'
const thumbHoverColor = '#ffffff'
const upperBackground = `linear-gradient(to bottom, ${upperColor}, ${upperColor}) 100% 50% / 100% ${trackHeight} no-repeat transparent`
const lowerBackground = `linear-gradient(to bottom, ${lowerColor}, ${lowerColor}) 100% 50% / 100% ${trackHeight} no-repeat transparent`

const Range = styled.input`
  display: block;
  min-width: 100%;
  height: ${height};
  margin: 0;
  background: transparent;
  cursor: pointer;
  appearance: none;
  overflow: hidden;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: ${height};
    border-radius: ${height};
    background: ${lowerBackground};
  }

  &::-webkit-slider-thumb {
    position: relative;
    top: 50%;
    width: ${thumbHeight}px;
    height: ${thumbHeight}px;
    border: 0;
    border-radius: 100%;
    background: ${thumbColor};
    appearance: none;
    transform: translateY(-50%);
    transition: background-color 150ms;
  }

  &::-moz-range-track,
  &::-moz-range-progress {
    width: 100%;
    height: ${height};
    background: ${upperBackground};
  }

  &::-moz-range-progress {
    background: ${lowerBackground};
  }

  &::-moz-range-thumb {
    width: ${thumbHeight};
    height: ${thumbHeight};
    margin: 0;
    border: 0;
    border-radius: 100%;
    background: ${thumbColor};
    appearance: none;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: ${height};
    border: 0;
    background: transparent;

    /* color needed to hide track marks */
    color: transparent;
  }

  &::-ms-fill-lower {
    background: ${lowerBackground};
  }

  &::-ms-fill-upper {
    background: ${upperBackground};
  }

  &::-ms-thumb {
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    width: ${thumbHeight};
    height: ${thumbHeight};
    margin: 0;
    border: 0;
    border-radius: 100%;
    background: ${thumbColor};
    box-shadow: none;
    appearance: none;
    transition: background-color 150ms;
  }

  &:hover {
    &::-webkit-slider-thumb {
      background-color: ${thumbHoverColor};
    }
    &::-moz-range-thumb {
      background-color: ${thumbHoverColor};
    }
    &::-ms-thumb {
      background-color: ${thumbHoverColor};
    }
  }
`

export default Range

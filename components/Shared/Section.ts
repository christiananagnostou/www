import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

// Base section with sophisticated gradients and layered effects
export const Section = styled(motion.section)<{ $variant?: 'default' | 'transparent' | 'elevated' }>`
  position: relative;
  margin: 3rem 0;
  padding: 2rem clamp(1.25rem, 3vw, 2.25rem);
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $variant = 'default' }) => {
    switch ($variant) {
      case 'transparent':
        return css`
          margin: 2rem 0;
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          &::before {
            display: none;
          }
        `
      case 'elevated':
        return css`
          border: 1px solid rgb(255 255 255 / 8%);
          border-radius: var(--border-radius-md);
          background: linear-gradient(135deg, #1e1e1e 0%, #191919 100%);
          box-shadow:
            0 16px 40px -12px rgb(0 0 0 / 40%),
            0 2px 0 rgb(255 255 255 / 2%) inset;
          &:hover {
            border-color: rgb(255 255 255 / 15%);
            box-shadow: 0 20px 50px -12px rgb(0 0 0 / 50%);
          }
        `
      default:
        return css`
          border: 1px solid #242424;
          border-radius: var(--border-radius-md);
          background: linear-gradient(135deg, var(--dark-bg) 0%, #171717 50%, #1a1a1a 100%);
          box-shadow:
            0 8px 32px -12px rgb(0 0 0 / 40%),
            0 2px 0 rgb(255 255 255 / 2%) inset;
        `
    }
  }}

  &::before {
    content: '';
    position: absolute;
    background:
      radial-gradient(circle at 70% 20%, rgb(255 255 255 / 4%), transparent 45%),
      linear-gradient(145deg, rgb(255 255 255 / 3%), transparent 55%);
    pointer-events: none;
    inset: 0;
    mix-blend-mode: overlay;
  }
`

// Unified section header with gradient text and optional actions
export const SectionHeader = styled.div<{ $align?: 'left' | 'center' | 'between' }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${({ $align = 'between' }) => {
    if ($align === 'center') return 'center'
    if ($align === 'left') return 'flex-start'
    return 'space-between'
  }};
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    background: linear-gradient(90deg, var(--heading), #c0c0c0 70%);
    background-clip: text;
    font-weight: 600;
    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
    color: transparent;
    letter-spacing: 0.5px;
  }

  .section-meta {
    padding: 0.4rem 0.8rem;
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: var(--border-radius-md);
    background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
    font-weight: 500;
    font-size: 0.75rem;
    color: var(--text-dark);
    letter-spacing: 0.5px;
  }
`

// Grid layouts for responsive content
export const Grid = styled.div<{
  $cols?: string
  $gap?: string
  $minWidth?: string
}>`
  display: grid;
  gap: ${({ $gap = '1rem' }) => $gap};
  grid-template-columns: ${({ $cols, $minWidth = '140px' }) => $cols || `repeat(auto-fit, minmax(${$minWidth}, 1fr))`};
`

// Enhanced button component with multiple variants
export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'ghost' | 'chip'
  $size?: 'sm' | 'md' | 'lg'
  $active?: boolean
}>`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s ease;

  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.35rem 0.6rem;
          border-radius: var(--border-radius-md);
          font-size: 0.65rem;
        `
      case 'lg':
        return css`
          padding: 0.7rem 1.2rem;
          border-radius: var(--border-radius-md);
          font-size: 0.9rem;
        `
      default:
        return css`
          padding: 0.45rem 0.85rem;
          font-size: 0.7rem;
        `
    }
  }}

  ${({ $variant = 'primary', $active = false }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          border: 1px solid rgb(255 255 255 / 8%);
          background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
          color: var(--text-dark);
          &:hover {
            border-color: rgb(255 255 255 / 15%);
            color: var(--text);
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: var(--text-dark);
          &:hover {
            background: rgb(255 255 255 / 5%);
            color: var(--text);
          }
        `
      case 'chip':
        return css`
          border: 1px solid rgb(255 255 255 / 8%);
          border-radius: var(--border-radius-md);
          background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
          color: var(--text-dark);

          ${
            $active &&
            css`
              border-color: rgb(255 255 255 / 20%);
              background: linear-gradient(135deg, var(--accent), #404040);
              box-shadow: 0 4px 12px -4px rgb(0 0 0 / 30%);
              color: var(--heading);
            `
          }

          &:hover {
            ${
              !$active &&
              css`
                border-color: rgb(255 255 255 / 20%);
                background: linear-gradient(135deg, var(--accent), #404040);
                color: var(--heading);
              `
            }
          }
        `
      default:
        return css`
          border: 1px solid rgb(255 255 255 / 10%);
          background: linear-gradient(135deg, var(--accent), #404040);
          color: var(--dark-bg);
          &:hover {
            box-shadow: 0 6px 20px -6px rgb(0 0 0 / 30%);
          }
        `
    }
  }}

  &::before {
    content: '';
    position: absolute;
    background: linear-gradient(135deg, rgb(255 255 255 / 10%), transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
    inset: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

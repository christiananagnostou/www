import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

// Base section with sophisticated gradients and layered effects
export const Section = styled(motion.section)<{ $variant?: 'default' | 'transparent' | 'elevated' }>`
  position: relative;
  margin: 3rem 0;
  padding: 2rem clamp(1.25rem, 3vw, 2.25rem);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $variant = 'default' }) => {
    switch ($variant) {
      case 'transparent':
        return css`
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          margin: 2rem 0;
          &:before {
            display: none;
          }
        `
      case 'elevated':
        return css`
          background: linear-gradient(135deg, #1e1e1e 0%, #191919 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 16px 40px -12px rgba(0, 0, 0, 0.4),
            0 2px 0 rgba(255, 255, 255, 0.02) inset;

          &:hover {
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
          }
        `
      default:
        return css`
          background: linear-gradient(135deg, var(--dark-bg) 0%, #171717 50%, #1a1a1a 100%);
          border: 1px solid #242424;
          box-shadow:
            0 8px 32px -12px rgba(0, 0, 0, 0.4),
            0 2px 0 rgba(255, 255, 255, 0.02) inset;
        `
    }
  }}

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.04), transparent 45%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.03), transparent 55%);
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`

// Unified section header with gradient text and optional actions
export const SectionHeader = styled.div<{ $align?: 'left' | 'center' | 'between' }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align = 'between' }) =>
    $align === 'center' ? 'center' : $align === 'left' ? 'flex-start' : 'space-between'};
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, var(--heading), #c0c0c0 70%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .section-meta {
    background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.4rem 0.8rem;
    border-radius: 10px;
    font-size: 0.75rem;
    color: var(--text-dark);
    letter-spacing: 0.5px;
    font-weight: 500;
  }
`

// Grid layouts for responsive content
export const Grid = styled.div<{
  $cols?: string
  $gap?: string
  $minWidth?: string
}>`
  display: grid;
  grid-template-columns: ${({ $cols, $minWidth = '140px' }) => $cols || `repeat(auto-fit, minmax(${$minWidth}, 1fr))`};
  gap: ${({ $gap = '1rem' }) => $gap};
`

// Enhanced button component with multiple variants
export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'ghost' | 'chip'
  $size?: 'sm' | 'md' | 'lg'
  $active?: boolean
}>`
  position: relative;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: 0.35rem 0.6rem;
          font-size: 0.65rem;
          border-radius: 8px;
        `
      case 'lg':
        return css`
          padding: 0.7rem 1.2rem;
          font-size: 0.9rem;
          border-radius: 12px;
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
          background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-dark);

          &:hover {
            border-color: rgba(255, 255, 255, 0.15);
            color: var(--text);
            transform: translateY(-1px);
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: var(--text-dark);

          &:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text);
          }
        `
      case 'chip':
        return css`
          background: linear-gradient(135deg, var(--body-bg), #1c1c1c);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-dark);
          border-radius: 12px;

          ${$active &&
          css`
            background: linear-gradient(135deg, var(--accent), #404040);
            color: var(--heading);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.3);
          `}

          &:hover {
            transform: translateY(-1px);
            ${!$active &&
            css`
              background: linear-gradient(135deg, var(--accent), #404040);
              color: var(--heading);
              border-color: rgba(255, 255, 255, 0.2);
            `}
          }
        `
      default:
        return css`
          background: linear-gradient(135deg, var(--accent), #404040);
          color: var(--dark-bg);
          border: 1px solid rgba(255, 255, 255, 0.1);

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px -6px rgba(0, 0, 0, 0.3);
          }
        `
    }
  }}

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover:before {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
  }
`

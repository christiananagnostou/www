import Link from 'next/link'
import styled from 'styled-components'
import AnimatedFire from '../SVG/AnimatedFire'
import Experiment from '../SVG/Experiment'

const LabLink = () => {
  return (
    <StyledLink href="/lab">
      <Experiment />
      The Lab
      <AnimatedFire />
    </StyledLink>
  )
}

export default LabLink

const StyledLink = styled(Link)`
  position: relative;

  top: 0.5rem;

  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: var(--border-radius-sm);
  filter: url('#fire');
  font-size: 1rem;
  color: var(--fire-color) !important;

  text-decoration: none !important;
  text-shadow:
    0 0 1px var(--fire-color),
    0 0 1px var(--fire-color),
    0 0 1px var(--fire-color);
  letter-spacing: 0.03em;
  transition: all 0.3s ease-in-out;

  --fire-color: var(--text-dark);

  .fire-svg {
    width: 0;
    height: 0;
  }

  &:hover {
    --fire-color: #ff8c3b;
    text-shadow:
      0 0 10px var(--fire-color),
      0 0 40px var(--fire-color),
      0 0 80px var(--fire-color);
  }
`

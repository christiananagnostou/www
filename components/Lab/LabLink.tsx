import Link from 'next/link'
import styled from 'styled-components'
import AnimatedFire from '../SVG/AnimatedFire'
import Experiment from '../SVG/Experiment'

type Props = {}

const LabLink = (props: Props) => {
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
  filter: url(#fire);
  --fire-color: var(--text-dark);

  display: flex;
  gap: 0.25rem;
  align-items: center;
  border-radius: 5px;
  font-size: 1rem;
  letter-spacing: 0.03em;

  top: 0.5rem;
  position: relative;

  text-decoration: none !important;
  color: var(--fire-color) !important;
  text-shadow: 0 0 1px var(--fire-color), 0 0 1px var(--fire-color), 0 0 1px var(--fire-color);
  transition: all 0.3s ease-in-out;

  .fire-svg {
    height: 0;
    width: 0;
  }

  &:hover {
    --fire-color: #ff8c3b;
    text-shadow: 0 0 10px var(--fire-color), 0 0 40px var(--fire-color), 0 0 80px var(--fire-color);
  }
`

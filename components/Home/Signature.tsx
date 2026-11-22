import styled from 'styled-components'

export default function Signature() {
  return (
    <SignOff>
      <source media="(prefers-reduced-motion: reduce)" srcSet="/signature.svg#still" />
      <img alt="" height={320} src="/signature.svg" width={556} />
    </SignOff>
  )
}

const SignOff = styled.picture`
  align-self: flex-start;
  width: 6.75rem;
  max-width: 100%;
  margin-top: 0.5rem;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`

import Image from 'next/image'
import styled from 'styled-components'

const Signature = () => {
  return <StyledImage alt="Signature of Christian Anagnostou" height={74} src="/signature.png" width={128} />
}

export default Signature

const StyledImage = styled(Image)`
  display: block;
  width: 100px;
  height: 45px;
  pointer-events: none;
  user-select: none;
  transform: translateY(0.5rem) scale(0.9);
  transform-origin: center center;
  align-self: center;
`

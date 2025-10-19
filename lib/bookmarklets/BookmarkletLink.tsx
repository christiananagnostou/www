import type { AnchorHTMLAttributes, JSX, PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

interface BookmarkletLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  code: string
}

export default function BookmarkletLink({
  code,
  children,
  ...props
}: PropsWithChildren<BookmarkletLinkProps>): JSX.Element {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    linkRef.current?.setAttribute('href', code)
  }, [code])

  return (
    <TitleLink ref={linkRef} {...props}>
      {children}
    </TitleLink>
  )
}

const TitleLink = styled.a`
  font-weight: 300;
  color: var(--heading);
  text-decoration: underline solid var(--accent);
  text-underline-offset: 3px;

  &:hover,
  &:focus {
    outline: none;
    text-decoration: underline solid var(--text-dark);
  }
`

import React, { useRef, useEffect, AnchorHTMLAttributes, JSX, PropsWithChildren } from 'react'
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
  color: var(--heading);
  text-decoration: none;
  font-weight: 300;
  transition: text-decoration 0.2s ease;

  &:hover,
  &:focus {
    text-decoration: underline;
    outline: none;
  }
`

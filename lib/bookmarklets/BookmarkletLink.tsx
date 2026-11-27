import type { AnchorHTMLAttributes, JSX, PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'

import styles from './BookmarkletLink.module.css'

interface BookmarkletLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  code: string
}

export default function BookmarkletLink({
  code,
  children,
  className,
  ...props
}: PropsWithChildren<BookmarkletLinkProps>): JSX.Element {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    linkRef.current?.setAttribute('href', code)
  }, [code])

  return (
    <a {...props} ref={linkRef} className={className ? `${styles.link} ${className}` : styles.link}>
      {children}
    </a>
  )
}

import { useRouter } from 'next/router'
import Nav from './Nav'

interface Props {
  children?: React.ReactNode
  title?: string
}

const Layout = ({ children }: Props) => {
  const { pathname } = useRouter()
  const shouldShowBlur = !pathname.startsWith('/article/')

  return (
    <>
      <Nav />
      {shouldShowBlur && <div className="blur" aria-hidden="true" />}

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}

export default Layout

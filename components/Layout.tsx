import Nav from './Nav'

interface Props {
  children?: React.ReactNode
  title?: string
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Nav />
      <div className="blur" aria-hidden="true" />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}

export default Layout

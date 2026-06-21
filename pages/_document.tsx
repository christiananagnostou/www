import type { DocumentContext } from 'next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { BASE_URL, X_HANDLE } from '../lib/constants'

const pageEntryAnimationScript = `
  (() => {
    try {
      const navigation = performance.getEntriesByType('navigation')[0]
      const isFreshNavigation = navigation
        ? navigation.type === 'navigate'
        : performance.navigation?.type === 0
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (isFreshNavigation && !prefersReducedMotion) {
        document.documentElement.dataset.pageEntry = 'pending'
      }
    } catch {}
  })()
`

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentsSheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => styledComponentsSheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentsSheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      styledComponentsSheet.seal()
    }
  }

  render() {
    return (
      <Html dir="ltr" lang="en">
        <Head>
          <meta charSet="utf-8" />
          <script dangerouslySetInnerHTML={{ __html: pageEntryAnimationScript }} />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lobster&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,200;1,6..72,300;1,6..72,400&display=swap"
            rel="stylesheet"
          />

          <link href="/A-square.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/A-no-bg.png" rel="icon" type="image/png" />
          <link href="/manifest.json" rel="manifest" />

          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#111" name="theme-color" />

          <meta content="Christian Anagnostou" property="og:site_name" />
          <meta content="en_US" property="og:locale" />
          <meta content="website" property="og:type" />
          <meta content="Christian Anagnostou" property="og:title" />
          <meta content="Christian Anagnostou's personal website" property="og:description" />
          <meta content={BASE_URL} property="og:url" />

          <meta content={X_HANDLE} name="twitter:site" />
          <meta content="index,follow" name="robots" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

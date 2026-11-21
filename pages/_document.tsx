import type { DocumentContext } from 'next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { X_HANDLE } from '../lib/constants'

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

          <link href="/A-square.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/A-no-bg.png" rel="icon" type="image/png" />
          <link href="/manifest.json" rel="manifest" />

          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#111" name="theme-color" />

          <meta content="Christian Anagnostou" property="og:site_name" />
          <meta content="en_US" property="og:locale" />

          <meta content={X_HANDLE} name="twitter:site" />
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

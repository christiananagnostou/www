import * as m from 'framer-motion/m'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'

import { fade, pageAnimation } from '../components/animation'
import { usePageTransitionInitial } from '../components/animation/MotionProvider'
import { Heading } from '../components/Shared/Heading'
import { SITE_ORIGIN } from '../lib/constants'

const intro =
  'This page covers the portfolio at christiancodes.co. You don’t need an account to read an article, browse the photos, or look at a project.'
const url = `${SITE_ORIGIN}/privacy`

export default function Privacy() {
  const initial = usePageTransitionInitial()
  return (
    <>
      <Head>
        <title>Privacy | Christian Anagnostou</title>
        <meta name="description" content={intro} />
        <link rel="canonical" href={url} />
        <meta key="og:title" property="og:title" content="Privacy" />
        <meta key="og:description" property="og:description" content={intro} />
        <meta key="og:url" property="og:url" content={url} />
      </Head>
      <Page initial={initial} animate="show" exit="exit" variants={pageAnimation}>
        <Heading variants={fade}>
          <h1>Privacy</h1>
          <p>{intro}</p>
        </Heading>
        <Copy>
          <h2>When you send a message</h2>
          <p>
            The <Link href="/contact">contact form</Link> sends the name, email address, subject, and message you enter
            through EmailJS so the note reaches my inbox. Your email is optional; include it if you want a reply. Please
            don’t send passwords or other sensitive information through the form.
          </p>
          <h2>Visits and interactions</h2>
          <p>
            Vercel hosts the site. I use its Web Analytics to see which pages get visited and Speed Insights to see how
            quickly they load. Liking an article or installing a bookmarklet updates a counter. To avoid counting repeat
            installs, the bookmarklet counter keeps a key based on the requesting IP address for up to 24 hours. The
            site also uses your browser’s local storage to remember those actions. Clearing this site’s data clears
            those local reminders; it doesn’t undo the aggregate counts.
          </p>
          <p>
            Projects and social links can take you to other services with their own privacy practices. For a question
            about data on this site or a message you’ve sent, <Link href="/contact">contact me here</Link>.
          </p>
        </Copy>
      </Page>
    </>
  )
}

const Page = styled(m.article)`
  max-width: 40rem;
  margin: 2rem auto 4rem;
  padding: 0 1rem;
`

const Copy = styled.div`
  color: var(--text);
  font-size: 0.94rem;
  line-height: 1.6;
  h2 {
    margin: 1.75rem 0 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--heading);
  }
  p + p {
    margin-top: 0.75rem;
  }
`

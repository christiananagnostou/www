import Link from 'next/link'

import InfoPage from '../components/Shared/InfoPage'

export default function Privacy() {
  return (
    <InfoPage
      title="Privacy"
      path="/privacy"
      intro="This page covers the portfolio at christiancodes.co. You don’t need an account to read an article, browse the photos, or look at a project."
    >
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
        installs, the bookmarklet counter keeps a key based on the requesting IP address for up to 24 hours. The site
        also uses your browser’s local storage to remember those actions. Clearing this site’s data clears those local
        reminders; it doesn’t undo the aggregate counts.
      </p>
      <p>
        Projects and social links can take you to other services with their own privacy practices. For a question about
        data on this site or a message you’ve sent, <Link href="/contact">contact me here</Link>.
      </p>
    </InfoPage>
  )
}

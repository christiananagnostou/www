import Link from 'next/link'

import InfoPage from '../components/Shared/InfoPage'

export default function About() {
  return (
    <InfoPage
      title="About"
      path="/about"
      intro="I’m Christian Anagnostou. I’m a lead software engineer at Vuori, and this is my personal corner of the web."
    >
      <h2>Things I build</h2>
      <p>
        Most of my favorite projects started with something I wanted to use myself. In 2021 my cousin George and I
        wanted a better way to keep track of our workouts. That became <Link href="/work/liftclub">Lift Club</Link>. I
        still work on it, often after someone who uses it sends me a good idea.{' '}
        <Link href="/work/jukebox">Jukebox</Link> came from a different itch: listening to my own music collection when
        I’m away from my computer.
      </p>
      <h2>Away from the keyboard</h2>
      <p>
        I take <Link href="/art">photographs</Link>, train across a few <Link href="/fitness">disciplines</Link>, and
        follow the San Francisco Giants. The <Link href="/articles">articles</Link> are where I write down things I’ve
        learned along the way. If something you found here sparked a question,{' '}
        <Link href="/contact">send me a note</Link>.
      </p>
    </InfoPage>
  )
}

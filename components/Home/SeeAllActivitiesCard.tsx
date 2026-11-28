import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { ride, run, swim, weight } from '../SVG/fitness/icons'

import styles from './SeeAllActivitiesCard.module.css'

const corners = { 'top-left': run, 'top-right': ride, 'bottom-left': swim, 'bottom-right': weight }

export default function SeeAllActivitiesCard() {
  const ref = useRef<HTMLLIElement>(null)
  const [seeAllInView, setSeeAllInView] = useState(false)

  useEffect(() => {
    const item = ref.current
    if (!item || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setSeeAllInView(entry.intersectionRatio >= 0.8), {
      root: item.parentElement,
      threshold: 0.8,
    })
    observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <li className={styles.item} ref={ref}>
      <Link className={styles.seeAllContent} data-in-view={seeAllInView} href="/fitness">
        {Object.entries(corners).map(([corner, icon]) => (
          <div key={corner} className={styles.floatingIcon} data-corner={corner} aria-hidden="true">
            {icon()}
          </div>
        ))}
        <span className={styles.seeAllText}>See All Activities</span>
      </Link>
    </li>
  )
}

import * as m from 'framer-motion/m'
import { useEffect, useRef, type RefObject } from 'react'

import { photoFilters } from '../../lib/art/gallery'
import { fade } from '../animation'

import controls from '../Shared/ButtonRow.module.css'

type SelectionProps = {
  activeTag: string | null
  onSelect: (tag: string | null) => void
}

type ActiveButtonRef = RefObject<HTMLButtonElement | null>

export function PhotoTags({
  tags,
  activeTag,
  onSelect,
  activeButtonRef,
}: SelectionProps & { tags: readonly (string | null)[]; activeButtonRef?: ActiveButtonRef }) {
  return tags.map((tag) => {
    const selected = tag === activeTag
    return (
      <button
        key={tag ?? 'All'}
        ref={selected ? activeButtonRef : undefined}
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(selected ? null : tag)}
      >
        {tag ?? 'All'}
      </button>
    )
  })
}

export default function PhotoFilters({
  activeTag,
  onSelect,
  activeButtonRef,
}: SelectionProps & { activeButtonRef: ActiveButtonRef }) {
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = row.current
    const selected = activeButtonRef.current
    if (!viewport || !selected || viewport.scrollWidth <= viewport.clientWidth) return
    const bounds = viewport.getBoundingClientRect()
    const button = selected.getBoundingClientRect()
    const left = Math.min(0, button.left - bounds.left) + Math.max(0, button.right - bounds.right)
    if (left) viewport.scrollBy({ left, behavior: 'instant' })
  }, [activeTag, activeButtonRef])

  return (
    <m.div variants={fade}>
      <div className={controls.buttonRow} ref={row} role="group" aria-label="Filter photographs">
        <PhotoTags tags={photoFilters} activeTag={activeTag} onSelect={onSelect} activeButtonRef={activeButtonRef} />
      </div>
    </m.div>
  )
}

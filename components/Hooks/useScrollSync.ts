import { useEffect, useRef } from 'react'

interface RefProp extends HTMLDivElement {
  eY: number
  eX: number
}

const names = new Map<string, Array<React.RefObject<RefProp | null>>>()

export const useScrollSync = (id: string) => {
  const ref = useRef<RefProp>(null)

  useEffect(() => {
    const refs = names.get(id)
    if (refs) names.set(id, [...refs, ref])
    else names.set(id, [ref])

    names.set(id, names.get(id)?.filter((r) => r.current) || [])
  }, [id, ref])

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    const onScroll = () => {
      const elements = names.get(id)
      if (!elements) return

      let scrollX = el.scrollLeft
      let scrollY = el.scrollTop

      const xRate = scrollX / (el.scrollWidth - el.clientWidth)
      const yRate = scrollY / (el.scrollHeight - el.clientHeight)

      const updateX = scrollX !== el.eX
      const updateY = scrollY !== el.eY

      el.eX = scrollX
      el.eY = scrollY

      for (const elem of elements) {
        const otherEl = elem.current
        if (!otherEl) continue

        if (otherEl !== el) {
          if (
            updateX &&
            Math.round(
              otherEl.scrollLeft -
                (scrollX = otherEl.eX = Math.round(xRate * (otherEl.scrollWidth - otherEl.clientWidth)))
            )
          ) {
            otherEl.scrollLeft = scrollX
          }

          if (
            updateY &&
            Math.round(
              otherEl.scrollTop -
                (scrollY = otherEl.eY = Math.round(yRate * (otherEl.scrollHeight - otherEl.clientHeight)))
            )
          ) {
            otherEl.scrollTop = scrollY
          }
        }
      }
    }

    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [id, ref])

  return ref
}

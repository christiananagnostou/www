import s from './ProjectDesigns.module.css'

// Each glyph has a legible resting pose; the one moving group explains the instrument.
export default function renderInstrument(slug: string) {
  const drawing = instrumentDrawing(slug)
  if (!drawing) return null
  return (
    <svg className={s.instrument} data-instrument={slug} viewBox="0 0 160 88" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {drawing}
      </g>
    </svg>
  )
}

function instrumentDrawing(slug: string) {
  switch (slug) {
    case 'liftclub':
      return (
        <>
          <path opacity=".35" d="M20 67h120M38 66V28m84 38V28M32 31h12m72 0h12" />
          <g className={s.lift}>
            <path d="M24 45h112" />
            {[32, 43, 110, 121].map((x) => (
              <rect key={x} x={x} y="31" width="7" height="28" rx="2" fill="currentColor" />
            ))}
          </g>
        </>
      )
    case 'jukebox':
      return (
        <>
          <rect x="23" y="10" width="114" height="68" rx="5" opacity=".35" />
          <g className={s.disc}>
            <circle cx="66" cy="44" r="26" />
            <circle cx="66" cy="44" r="7" fill="currentColor" />
            <path d="M47 42a19 19 0 0 1 16-17m21 21a18 18 0 0 1-15 16" opacity=".65" />
          </g>
          <path d="M113 24v17L92 58m-2 2 5-5" />
          <circle cx="113" cy="24" r="3" />
        </>
      )
    case 'imgpress':
      return (
        <>
          <path d="M26 20v47m105-47v47" opacity=".4" />
          <rect x="32" y="27" width="92" height="9" rx="2" opacity=".4" fill="currentColor" stroke="none" />
          <rect className={s.compress} x="32" y="49" width="92" height="9" rx="2" fill="currentColor" stroke="none" />
        </>
      )
    case 'skillbox':
    case 'knip-html-reporter':
      return (
        <>
          <rect x="22" y="15" width="116" height="59" rx="5" opacity=".5" />
          <path d="M23 28h114m-106-7h1m5 0h1" opacity=".55" />
          <path d="m36 41 6 5-6 5m12 0h11" />
          <g className={s.output}>
            <path d="M68 43h49m-49 9h29m-29 9h37" />
          </g>
        </>
      )
    default:
      return null
  }
}

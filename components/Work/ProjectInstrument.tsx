import s from './ProjectInstrument.module.css'

// Each glyph has a legible resting pose; the one moving group explains the instrument.
export default function ProjectInstrument({ slug }: { slug: string }) {
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
    case 'knip-html-reporter':
      return (
        <>
          <rect x="37" y="14" width="73" height="60" rx="4" opacity=".65" />
          <path d="M48 26h30m-30 11h45m-45 9h33m-33 9h40m-40 9h24" opacity=".5" />
          <g className={s.lens}>
            <circle cx="96" cy="44" r="13" fill="var(--instrument-bg)" />
            <path d="m106 54 13 13m-31-25h14m-14 5h9" />
          </g>
        </>
      )
    case 'qwikdraw':
      return (
        <>
          <path d="M26 69h109M37 17v50" opacity=".28" strokeDasharray="3 5" />
          <g className={s.selection}>
            <path d="m50 54 20-28 26 28z" fill="currentColor" fillOpacity=".13" />
            <rect x="45" y="21" width="57" height="38" strokeDasharray="3 3" opacity=".65" />
            {[
              [45, 21],
              [102, 21],
              [45, 59],
              [102, 59],
            ].map(([x, y]) => (
              <rect key={x + ':' + y} x={x - 2} y={y - 2} width="4" height="4" fill="currentColor" />
            ))}
            <path d="m94 46 3 21 5-7 8-1z" fill="var(--instrument-bg)" />
          </g>
        </>
      )
    case 'electriq-app':
      return (
        <>
          <rect x="23" y="15" width="114" height="59" rx="4" opacity=".5" />
          <path d="M23 28h114m-76 0v46m38-46v46m-68-53h14m24 0h14m24 0h14" opacity=".45" />
          <path d="M31 56h21m17-19h22m16 0h21" opacity=".45" />
          <g className={s.ticket}>
            <rect x="30" y="34" width="24" height="13" rx="2" fill="var(--instrument-bg)" />
            <path d="M35 40h12" />
          </g>
        </>
      )
    case 'soylent':
      return (
        <>
          <path
            d="M74 21v4c0 5-6 12-6 23v24q0 4 4 4h16q4 0 4-4V48c0-11-6-18-6-23v-4z"
            fill="currentColor"
            fillOpacity=".1"
          />
          <path d="M69 44q11 2 22 0m-22 25q11 2 22 0" opacity=".45" />
          <rect x="72" y="51" width="16" height="8" rx="1" />
          <path d="M76 55h8m-9 8h6" opacity=".65" />
          <g className={s.cap}>
            <rect x="73" y="14" width="14" height="8" rx="2" fill="var(--instrument-bg)" />
            <path d="M76 16v3m4-3v3m4-3v3" opacity=".5" />
          </g>
        </>
      )
    case 'scentfill':
      return (
        <>
          {[
            'M77 35q0-6 6-5 1 6-6 5z',
            'M77 32l3-3 3 3-3 4z',
            'M80 36q-6-4-2-6l2 2 2-2q4 2-2 6z',
            'M76 34q3-6 8-4-1 6-8 4z',
            'M77 33q3-6 6 0-3 5-6 0z',
          ].map((petal, i) => (
            <g key={petal} transform={`rotate(${(i - 2) * 36} 80 64)`}>
              <path
                d="M68 26a40 40 0 0 1 24 0l-6 18a21 21 0 0 0-12 0z"
                fill="currentColor"
                fillOpacity={0.08 + i * 0.06}
              />
              <path d={petal} />
            </g>
          ))}
          <g className={s.needle}>
            <path d="m78 62 2-15 2 15z" fill="currentColor" />
          </g>
          <circle cx="80" cy="64" r="3" fill="var(--instrument-bg)" />
        </>
      )
    case 'electriq-home':
      return (
        <>
          <g transform="rotate(-10 80 44)">
            <circle cx="80" cy="44" r="32" opacity=".32" />
            <g className={s.globeBands} strokeWidth="3.5" strokeLinecap="butt" strokeDasharray="2 2 1 2 3 2 2 6">
              <path d="M61 20q18 11 38 0m-50 16q31 19 62 0m-62 17q31 21 62 0m-53 13q22 13 44 0" />
              <path d="M48 44q32 20 64 0" strokeWidth="2" strokeDasharray="1 3 1 3 1 3 4 4" opacity=".65" />
            </g>
            <path d="M54 27q26 17 52 0m-55 32q29 20 58 0" opacity=".35" strokeDasharray="1 3" />
          </g>
        </>
      )
    case 'awildchristian':
      return (
        <>
          <path d="M55 10h50v68H55z" fill="currentColor" fillOpacity=".08" />
          <path d="M59 14h42v60H59z" opacity=".4" />
          <g className={s.print}>
            <path d="M62 17h36v49H62z" fill="var(--instrument-bg)" />
            <path d="M67 19v34m25-34v27M63 60l34-10" opacity=".3" />
            <path d="M68 37q8-18 24-6l-3 1-2 2-3-1-2 3-4-1-2 3-3-1z" fill="currentColor" fillOpacity=".5" />
            <path d="m80 34 2 9m-3-3-3 14 9-2-3-13m-4 16v6m4-7 2 5" />
          </g>
          <path d="m82 70 4-2-1 3 6-2" opacity=".7" />
        </>
      )
    case 'neologos':
      return (
        <>
          <path d="M29 23q23-7 50 2 27-9 51-2v44q-25-6-51 3-27-9-50-3zM79 25v45" />
          <path d="M39 35q14-3 27 1m-27 8q14-3 27 1m-27 8q10-2 20 0m30-2q12-4 26-2" opacity=".5" />
          <g className={s.vote}>
            <path d="m95 39 8-8 8 8m-8-8v16" />
          </g>
        </>
      )
    case 'lofiwaves':
      return (
        <>
          <circle cx="80" cy="29" r="17" fill="currentColor" fillOpacity=".1" />
          <path d="m65 36 9-12 8 9 5-7 9 8" />
          <circle cx="86" cy="20" r="2" fill="currentColor" />
          <path d="M40 56h80" opacity=".4" />
          <path className={s.elapsed} d="M40 56h24" />
          <g className={s.playhead}>
            <circle cx="64" cy="56" r="3" fill="currentColor" />
          </g>
          <path d="m63 68-4 3 4 3m34-6 4 3-4 3" opacity=".65" />
          <path d="m78 67 6 4-6 4z" fill="currentColor" />
        </>
      )
    default:
      return null
  }
}

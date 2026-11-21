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
          <path d="M24 71h110m-22-43h16l5 7v22h-21z" opacity=".4" />
          <g className={s.bottle}>
            <path d="M54 16h17v9l7 8q3 3 3 8v26q0 4-4 4H48q-4 0-4-4V41q0-5 3-8l7-8z" fill="var(--instrument-bg)" />
            <path d="M54 21h17M45 43h35m-35 17h35m-27-9h14" />
            <circle cx="62" cy="51" r="4" fill="currentColor" />
          </g>
          <path d="m92 44 6 0m-3-3v6" opacity=".6" />
        </>
      )
    case 'scentfill':
      return (
        <>
          <path d="M60 52h40l-2 16q-1 5-6 5H68q-5 0-6-5zM68 52V42h24v10m-20-5h16" />
          <g className={s.plume}>
            <path d="M74 36c-12-9 10-13-2-23m12 21c-5-7 13-12 6-22" />
            <path d="M94 37c4-6 11-7 11-15" opacity=".5" />
          </g>
        </>
      )
    case 'electriq-home':
      return (
        <>
          <rect x="29" y="20" width="100" height="54" rx="3" opacity=".5" />
          <path d="M30 32h98m-89-6h3m4 0h3m4 0h3M39 45h27m-27 8h18m-18 10h25" opacity=".6" />
          <g transform="translate(84 59)">
            <g className={s.swatches}>
              {[
                [-18, '.25'],
                [0, '.55'],
                [18, '1'],
              ].map(([angle, opacity]) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <rect x="-4" y="-29" width="11" height="32" rx="2" fill="var(--instrument-bg)" />
                  <path d="M-1-25h5v10h-5z" fill="currentColor" opacity={opacity} />
                </g>
              ))}
            </g>
          </g>
        </>
      )
    case 'awildchristian':
      return (
        <>
          <path d="M43 19h81v53H43z" opacity=".35" />
          <g className={s.print}>
            <path d="M34 13h79v53H34z" fill="var(--instrument-bg)" />
            <path d="M40 19h67v35H40z" />
            <path d="m42 51 18-18 14 13 10-8 20 13" />
            <circle cx="88" cy="29" r="4" />
            <path d="m83 60 7-3-2 5 8-4 6 1" />
          </g>
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
          <rect x="26" y="17" width="108" height="54" rx="6" />
          <path d="M37 58h86" opacity=".45" />
          <g className={s.levels}>
            {[11, 21, 16, 28, 12, 23, 16, 9, 20].map((h, i) => (
              <rect key={i} x={39 + i * 9} y={51 - h} width="4" height={h} rx="1" fill="currentColor" />
            ))}
          </g>
          <circle cx="69" cy="58" r="3" fill="currentColor" />
        </>
      )
    default:
      return null
  }
}

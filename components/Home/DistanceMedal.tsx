import type { DistanceRank } from '../../lib/fitness/home'

const medals = {
  1: { fill: '#e8bd55', label: 'Farthest' },
  2: { fill: '#c3cbd4', label: 'Second-farthest' },
  3: { fill: '#cf9168', label: 'Third-farthest' },
}

export default function DistanceMedal({ rank, sport }: { rank: DistanceRank; sport: string }) {
  const { fill, label } = medals[rank]
  const description = `${label} ${sport}`

  return (
    <svg role="img" aria-label={description} width="20" height="20" viewBox="0 0 256 256" fill={fill}>
      <title>{description}</title>
      {/* Adapted from Phosphor Medal (MIT); see public/licenses/phosphor-icons.txt. */}
      <circle cx="128" cy="96" r="72" opacity="0.16" />
      <path d="M216,96A88,88,0,1,0,72,163.83V240a8,8,0,0,0,11.58,7.16L128,225l44.43,22.21A8.07,8.07,0,0,0,176,248a8,8,0,0,0,8-8V163.83A87.85,87.85,0,0,0,216,96ZM56,96a72,72,0,1,1,72,72A72.08,72.08,0,0,1,56,96ZM168,227.06l-36.43-18.21a8,8,0,0,0-7.16,0L88,227.06V174.37a87.89,87.89,0,0,0,80,0Z" />
      <text x="128" y="139" textAnchor="middle" fontSize="116" fontWeight="700">
        {rank}
      </text>
    </svg>
  )
}

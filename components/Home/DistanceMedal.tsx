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
    <svg role="img" aria-label={description} width="20" height="20" viewBox="0 0 24 24">
      <title>{description}</title>
      <path fill={fill} d="M3 1h6l3 5-4 4zm12 0h6l-5 9-4-4z" />
      <circle cx="12" cy="14" r="9" fill={fill} />
      <text x="12" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#171717">
        {rank}
      </text>
    </svg>
  )
}

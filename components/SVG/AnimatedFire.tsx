const AnimatedFire = () => {
  return (
    <svg className="fire-svg">
      <filter id="fire">
        <feTurbulence baseFrequency="0.1 0.1" id="turbulence" numOctaves="10" seed="30">
          <animate attributeName="baseFrequency" dur="10s" repeatCount="indefinite" values="0.1 0.1;0.1 0.2;0.1 0.1" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </svg>
  )
}

export default AnimatedFire

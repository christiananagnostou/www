const AnimatedFire = () => {
  return (
    <svg className="fire-svg">
      <filter id="fire">
        <feTurbulence id="turbulence" baseFrequency="0.1 0.1" numOctaves="10" seed="30">
          <animate
            attributeName="baseFrequency"
            dur="10s"
            values="0.1 0.1;0.1 0.2;0.1 0.1"
            repeatCount="indefinite"
          ></animate>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="3"></feDisplacementMap>
      </filter>
    </svg>
  )
}

export default AnimatedFire

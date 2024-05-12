const ChildArrow = ({ height = 24, width = 24, rounded = false, color = 'currentColor' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path
        d={`M 24.82,15.8
          a 1,1 0 0 0 -1.5,0
          a 1,1 0 0 0 0,1.5
          L 27,21
          H 9
          v -${height}
          a ${rounded ? '1,1' : '0,0'} 0 1 0 -2,0
          V 21
          a 2,2 0 0 0 2,2
          H 27
          l -3.75,3.75
          a 1,1 0 0 0 0,1.5
          a 1,1 0 0 0 .7.3
          a 1,1 0 0 0 .7-.3
          L 31,22
          Z`}
      ></path>
    </svg>
  )
}

export default ChildArrow

import React from 'react';

const ChildArrow = ({ height = 24, width = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 36 36'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      fill={color}
    >
      <path d='M24.82,15.8a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.41L27.2,21H9V3.78a1,1,0,1,0-2,0V21a2,2,0,0,0,2,2H27.15l-3.74,3.75a1,1,0,0,0,0,1.41,1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29L31,22Z'></path>
    </svg>
  );
};

export default ChildArrow;

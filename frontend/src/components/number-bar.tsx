import React from 'react';

interface NumberBarProps {
  level: number;
  totalBars: number;
}

export const NumberBar = ({ level, totalBars }: NumberBarProps) => {
  const bars = [];
  let xPosition = 0;
  let yPosition = 13.1309;
  let height = 11;

  for (let i = 0; i < totalBars; i++) {
    const fillColor = i < level ? '#4E7BBA' : '#E1E1E1';

    bars.push(
      <rect
        x={xPosition}
        y={yPosition}
        width="4"
        height={height}
        rx="1"
        fill={fillColor}
      />
    );

    height = height + 4;
    xPosition = xPosition + 8;
    yPosition = yPosition - 4;
  }

  return (
    <svg
      style={{ width: `${totalBars * 4}px` }}
      className="h-full"
      viewBox="0 0 28 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {bars}
    </svg>
  );
};

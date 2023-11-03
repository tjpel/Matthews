import { useState } from 'react';

interface NumberRangeProps {
  min: number;
  max: number;
  value: [number, number];
}

export const NumberRange = ({ min, max, value }: NumberRangeProps) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  return <div></div>;
};

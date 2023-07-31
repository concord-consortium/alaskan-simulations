import React from "react";
import { CircularInput, CircularThumb } from "react-circular-input";

import css from "./time-circular-input.scss";

const RADIUS = 42;

interface IProps {
  value: number;
  onChange: (value: number) => void;
}

export const TimeCircularInput: React.FC<IProps> = ({ value, onChange }) => {
  const handleChange = (newValue: number) => {
    onChange(newValue * 24);
  };

  return (
    <CircularInput
      value={value / 24} // value is always between [0, 1]
      onChange={handleChange}
      radius={RADIUS}
      tabIndex={-1}
    >
      <circle strokeWidth="10" stroke="#1e2749" fill="none" cx={RADIUS} cy={RADIUS} r={RADIUS} />
      <CircularThumb className={css.timeInputHandle} r={12.5} tabIndex={0} />
    </CircularInput>
  );
};

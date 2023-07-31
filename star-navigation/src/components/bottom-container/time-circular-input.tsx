import React from "react";
import { CircularInput, CircularThumb } from "react-circular-input";

import css from "./time-circular-input.scss";

const RADIUS = 42;

const validHour = (hour: number) => (hour + 24) % 24;

interface IProps {
  value: number;
  onChange: (value: number) => void;
}

export const TimeCircularInput: React.FC<IProps> = ({ value, onChange }) => {
  const handleChange = (newValue: number) => {
    onChange(newValue * 24);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Increase value by 1 minute when user presses right arrow or space
    if (event.key === "ArrowRight" || event.key === " ") {
      onChange(validHour(value + 1 / 60));
    }
    // Decrease value by 1 minute when user presses left arrow
    else if (event.key === "ArrowLeft") {
      onChange(validHour(value - 1 / 60));
    }
    event.stopPropagation();
  };

  return (
    <div className={css.timeCircularInput} onKeyDown={handleKeyDown}>
      <CircularInput
        value={value / 24} // value is always between [0, 1]
        onChange={handleChange}
        radius={RADIUS}
        tabIndex={-1}
      >
        <circle strokeWidth="10" stroke="#1e2749" fill="none" cx={RADIUS} cy={RADIUS} r={RADIUS} />
        <CircularThumb className={css.timeInputHandle} r={12.5} tabIndex={0} />
      </CircularInput>
    </div>
  );
};

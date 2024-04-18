import React from "react";
import { Slider } from "./slider";

interface IProps {
  time: number; // between 0 and 1
  snapshotsCount: number;
  label: string|JSX.Element;
  onChange: (snapshotIdx: number) => void;
  disabled?: boolean;
}

export const TimeSlider: React.FC<IProps> = ({ time, onChange, disabled, label }) => {
  const handleChange = (e: Event, value: number) => {
    onChange(value);
  };

  return (
    <Slider
      value={time}
      min={0}
      max={4}
      step={1}
      label={label}
      onChange={handleChange}
      disabled={disabled}
      ariaLabel={"Time"}
    />
  );
};

import React from "react";
import { Slider as MUISlider, Mark } from "@mui/base";

import css from "./slider.scss";

export { Mark } from "@mui/base";

interface IProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string|JSX.Element;
  ariaLabel?: string;
  onChange: (event: Event, value: number) => void;
  disabled?: boolean;
  marks?: boolean | Mark[];
}

export const Slider: React.FC<IProps> = ({ value, min, max, step, onChange, disabled, label, ariaLabel, marks = true }) => {
  const handleChange = (e: Event, val: number | number[]) => {
    onChange(e, typeof val === "number" ? val : val[0]);
  };
  console.log("label", label);

  return (
    <div className={`${css.slider} ${disabled ? css.disabled : ""}`}>
      <div className={css.label}>
        {label}
      </div>
      <MUISlider
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        marks={marks}
      />
    </div>
  );
};

import React from "react";
import { SliderUnstyled, Mark } from "@mui/base";

import css from "./slider.scss";
import clsx from "clsx";

export { Mark } from "@mui/base";

interface IProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  onChange: (event: Event, value: number) => void;
  disabled?: boolean;
  marks?: boolean | Mark[];
}



export const Slider: React.FC<IProps> = ({ value, min, max, step, onChange, disabled, label, marks = true }) => {
  const handleChange = (e: Event, val: number | number[]) => {
    onChange(e, typeof val === "number" ? val : val[0]);
  };
  return (
    <div className={clsx(css.slider, {[css.disabled] : disabled})}>
      <div className={css.label}>{ label }</div>
      <SliderUnstyled
        aria-label={label}
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

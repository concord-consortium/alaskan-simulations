import React from "react";
import clsx from "clsx";
import { Slider } from "@mui/base";

import css from "./time-slider.scss";
import { sunriseSunset } from "../utils/daytime";

interface IProps {
  value: number;
  month: number;
  day: number;
  onChange: (event: Event, value: number) => void;
  disabled?: boolean;
}

export const TimeSlider: React.FC<IProps> = ({ value, month, onChange, disabled }) => {
  const handleChange = (e: Event, val: number | number[]) => {
    onChange(e, typeof val === "number" ? val : val[0]);
  };

  const { sunrise, sunset } = sunriseSunset[month - 1];

  const sunriseWidth = `${100 * sunrise / 24}%`;
  const sunsetStart = `${100 * sunset / 24}%`;
  const sunsetWidth = `${100 * (24 - sunset) / 24}%`;

  const Rail = () => (
    <div className={css.customRail}>
      <div className={css.beforeSunrise} style={{ width: sunriseWidth }} />
      <div className={css.afterSunset} style={{ left: sunsetStart, width: sunsetWidth }} />
    </div>
  );

  return (
    <div className={clsx(css.slider, {[css.disabled] : disabled})}>
      <Slider
        aria-label="Day of Time Slider"
        min={0}
        max={24}
        step={1/ 60}
        value={value}
        track={false}
        onChange={handleChange}
        disabled={disabled}
        slots={{
          rail: Rail,
        }}
      />
    </div>
  );
};

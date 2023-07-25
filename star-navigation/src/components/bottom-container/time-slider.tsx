import React from "react";
import clsx from "clsx";
import { Slider } from "@mui/base";
import { sunriseSunset } from "../../utils/daytime";

import css from "./time-slider.scss";

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
        step={0.01666666667} // 1 minute, 1/60 of an hour
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

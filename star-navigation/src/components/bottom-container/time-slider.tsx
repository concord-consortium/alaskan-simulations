import React from "react";
import clsx from "clsx";
import { Slider } from "@mui/base";
import { getTimes } from "suncalc";
import { dateToFractionalHoursInRightTimezone, getDateTimeString } from "../../utils/sim-utils";
import { config } from "../../config";

import css from "./time-slider.scss";

interface IProps {
  value: number;
  month: number;
  day: number;
  onChange: (event: Event, value: number) => void;
  disabled?: boolean;
}

export const TimeSlider: React.FC<IProps> = ({ value, day, month, onChange, disabled }) => {
  const { observerLat, observerLong } = config;

  const handleChange = (e: Event, val: number | number[]) => {
    onChange(e, typeof val === "number" ? val : val[0]);
  };

  const date = new Date(getDateTimeString({ month, day, timeOfDay: value }));
  const times = getTimes(date, observerLat, observerLong);
  const sunrise = dateToFractionalHoursInRightTimezone(times.sunrise);
  const sunset = dateToFractionalHoursInRightTimezone(times.sunset);

  const Rail = () => (
    <div className={css.customRail}>
      {
        sunrise < sunset ?
        <>
          <div className={css.beforeSunrise} style={{ width: `${100 * sunrise / 24}%` }} />
          <div className={css.afterSunset} style={{ left: `${100 * sunset / 24}%`, width: `${100 * (24 - sunset) / 24}%` }} />
        </>
        :
        <div className={css.night} style={{ left: `${100 * sunset / 24}%`, width: `${100 * (sunrise - sunset) / 24}%` }} />
      }
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

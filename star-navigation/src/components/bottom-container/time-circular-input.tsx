import React from "react";
import { CircularInput, CircularThumb } from "react-circular-input";
import { config } from "../../config";
import { getDaylightTimes, validFractionalHour } from "../../utils/daylight-utils";
import { arc } from "../../utils/svg-arc";

import css from "./time-circular-input.scss";

const RADIUS = 50;
const WIDTH = 10;

const HOUR_MARKS = Array.from(Array(24).keys());
interface IProps {
  value: number;
  month: number;
  day: number;
  onChange: (value: number) => void;
}

const describeArc = (start: number, end: number) =>
  arc({ x: RADIUS, y: RADIUS, R: RADIUS + 0.5 * WIDTH, r: RADIUS - 0.5 * WIDTH, start, end });

const hourToAngle = (hour: number) => hour * 360 / 24;

export const TimeCircularInput: React.FC<IProps> = ({ value, month, day, onChange }) => {
  const { observerLat, observerLong } = config;

  const handleChange = (newValue: number) => {
    onChange(newValue * 24);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Increase value by 1 minute when user presses right arrow or space
    if (event.key === "ArrowRight" || event.key === " ") {
      onChange(validFractionalHour(value + 1 / 60));
    }
    // Decrease value by 1 minute when user presses left arrow
    else if (event.key === "ArrowLeft") {
      onChange(validFractionalHour(value - 1 / 60));
    }
    event.stopPropagation();
  };

  const times = getDaylightTimes({ month, day, timeOfDay: value, lat: observerLat, long: observerLong });
  const sunrise = hourToAngle(times.sunrise);
  const sunset = hourToAngle(times.sunset);
  const nightStart = hourToAngle(times.nightStart);
  const nightEnd = hourToAngle(times.nightEnd);

  return (
    <div className={css.timeCircularInput} onKeyDown={handleKeyDown}>
      <CircularInput
        value={value / 24} // value is always between [0, 1]
        onChange={handleChange}
        radius={RADIUS}
        tabIndex={-1}
      >
        {/* Track */}
        <path className={css.nightTrack} d={describeArc(nightStart, nightEnd)} />
        <path className={css.daylightTrack} d={describeArc(sunrise, sunset)} />
        <path className={css.twilightTrack} d={describeArc(nightEnd, sunrise)} />
        <path className={css.twilightTrack} d={describeArc(sunset, nightStart)} />
        {/* "Hours" */}
        {
          HOUR_MARKS.map((hour) =>
            <circle
              key={hour}
              className={css.hour}
              cx={RADIUS} cy={10} r={2}
              style={{ transformOrigin: `${RADIUS}px ${RADIUS}px`, transform: `rotate(${hourToAngle(hour)}deg)` }}
            />
          )
        }
        {/* Hand of a clock */}
        <path
          className={css.handOfClock}
          d={`M ${RADIUS} 0 L ${RADIUS} ${RADIUS}`}
          style={{ transformOrigin: `${RADIUS}px ${RADIUS}px`, transform: `rotate(${hourToAngle(value)}deg)` }}
        />
        {/* Center point, just style */}
        <circle className={css.center} cx={RADIUS} cy={RADIUS} r={5} />
        <CircularThumb className={css.timeInputHandle} tabIndex={0} />
      </CircularInput>
    </div>
  );
};

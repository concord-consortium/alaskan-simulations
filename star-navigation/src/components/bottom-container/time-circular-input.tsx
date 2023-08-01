import React, { useCallback, useEffect } from "react";
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

  const handleChange = useCallback((newValue: number) => {
    onChange(newValue * 24);
  }, [onChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent | React.KeyboardEvent) => {
    // Increase value by 1 minute when user presses right arrow or space
    if (event.key === "ArrowRight" || event.key === " ") {
      onChange(validFractionalHour(value + 1 / 60));
    }
    // Decrease value by 1 minute when user presses left arrow
    else if (event.key === "ArrowLeft") {
      onChange(validFractionalHour(value - 1 / 60));
    }
    // Important to stop propagation, otherwise CircularInput will handle the event and change the value using too big
    // and not configurable step.
    event.stopPropagation();
  }, [onChange, value]);

  const times = getDaylightTimes({ month, day, timeOfDay: value, lat: observerLat, long: observerLong });
  const sunrise = hourToAngle(times.sunrise);
  const sunset = hourToAngle(times.sunset);
  const nightStart = hourToAngle(times.nightStart);
  const nightEnd = hourToAngle(times.nightEnd);

  // Set up keyboard handling globally. It should not conflict with any other component in this particular simulation,
  // and it might be useful to fine tune the time when users are calculating journey duration.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, onChange, value]);

  return (
    // It's necessary to handle keydown on the whole component, so the event can be captured and propagation stopped
    // before CircularInput handles it and changes the value using too big and not configurable step.
    <div className={css.timeCircularInput} onKeyDown={handleKeyDown}>
      <CircularInput
        value={value / 24} // value is always between [0, 1]
        onChange={handleChange}
        radius={RADIUS}
        tabIndex={-1} // disable focus, as default keyboard handling is not working well (too big step, not configurable)
      >
        {/* Track */}
        <path className={css.nightTrack} d={describeArc(nightStart, nightEnd)} />
        <path className={css.daylightTrack} d={describeArc(sunrise, sunset)} />
        <path className={css.twilightTrack} d={describeArc(nightEnd, sunrise)} />
        <path className={css.twilightTrack} d={describeArc(sunset, nightStart)} />
        {
          // Hour marks
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
        {/* Make thumb focusable by setting tabIndex=0 */}
        <CircularThumb className={css.timeInputHandle} tabIndex={0} />
      </CircularInput>
    </div>
  );
};

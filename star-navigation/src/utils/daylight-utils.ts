import { getTimes } from "suncalc";
import { getDateTimeString } from "./sim-utils";

export const dateToFractionalHoursInRightTimezone = (date: Date) => {
  const dateInTimezone = new Date(date.toLocaleString("en-US", {
    timeZone: "America/Anchorage"
  }));
  return dateInTimezone.getHours() + dateInTimezone.getMinutes() / 60;
};

export const validFractionalHour = (hour: number) => (hour + 24) % 24;

const MIN_NIGHT_DURATION = 0.5; // hour

// This function returns the sunrise, sunset, nightStart, and nightEnd times for a given date and location.
// NightStart and nightEnd are defined as the times when the sun is 18 degrees below the horizon, so in fact it's
// astronomical dusk and dawn, not nautical or civil dusk and dawn.
// In some locations and times of year, the sun may never reach 18 degrees below the horizon, so in that case
// nightStart and nightEnd are defined as the times very close (see MIN_NIGHT_DURATION) to the nadir (the lowest
// point of the sun's path through the sky).
export const getDaylightTimes = (options: { month: number; day: number; timeOfDay: number; lat: number; long: number; }) => {
  const { month, day, timeOfDay, lat, long } = options;
  const date = new Date(getDateTimeString({ month, day, timeOfDay }));
  const times = getTimes(date, lat, long);

  let nightStart = dateToFractionalHoursInRightTimezone(times.night);
  let nightEnd = dateToFractionalHoursInRightTimezone(times.nightEnd);
  const sunrise = dateToFractionalHoursInRightTimezone(times.sunrise);
  const sunset = dateToFractionalHoursInRightTimezone(times.sunset);

  if (isNaN(nightStart) || isNaN(nightEnd)) {
    nightStart = validFractionalHour(dateToFractionalHoursInRightTimezone(times.nadir) - 0.5 * MIN_NIGHT_DURATION);
    nightEnd = validFractionalHour(dateToFractionalHoursInRightTimezone(times.nadir) + 0.5 * MIN_NIGHT_DURATION);
  }

  return {
    sunrise, sunset, nightStart, nightEnd
  };
};

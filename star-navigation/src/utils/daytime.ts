import { IModelInputState } from "../types";

const parseTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  return parseInt(hour, 10) + (parseInt(minute, 10) / 60);
};

// using: the 15th of the month for 2022 at https://www.timeanddate.com/sun/usa/berkeley
/* eslint-disable no-tabs */
export const sunriseSunset = `
  January   7:23 am ↑ (116°)	5:14 pm ↑ (244°)
  February  6:58 am ↑ (105°)	5:48 pm ↑ (255°)
  March     7:19 am ↑ (92°)	  7:16 pm ↑ (268°)
  April     6:33 am ↑ (77°)	  7:45 pm ↑ (283°)
  May       5:58 am ↑ (65°)	  8:12 pm ↑ (295°)
  June      5:46 am ↑ (59°)	  8:33 pm ↑ (301°)
  July      5:59 am ↑ (62°)	  8:30 pm ↑ (298°)
  August    6:24 am ↑ (72°)	  8:01 pm ↑ (288°)
  September 6:51 am ↑ (86°)	  7:16 pm ↑ (274°)
  October   7:17 am ↑ (100°)	6:31 pm ↑ (259°)
  November  6:49 am ↑ (113°)	4:57 pm ↑ (247°)
  December  7:17 am ↑ (119°)	4:51 pm ↑ (241°)
`.split("\n")
.map(line => line.trim())
.filter(line => line.length > 0)
.map(line => {
  const parts = line.split(/\s/).filter(part => part.length > 0);
  return {sunrise: parseTime(parts[1]), sunset: 12 + parseTime(parts[5])};
});
/* eslint-enable no-tabs */

export const withinHour = (timeOfDay: number, fractionalHour: number) => {
  return (timeOfDay >= Math.floor(fractionalHour)) && (timeOfDay < Math.ceil(fractionalHour));
};

export const daytimeOpacity = (inputState: Pick<IModelInputState, "month" | "timeOfDay">) => {
  const month = (inputState.month || 1) - 1;
  const {sunrise, sunset} = sunriseSunset[month];
  const timeOfDay = inputState.timeOfDay;

  let result: number;
  if (withinHour(timeOfDay, sunrise) || withinHour(timeOfDay, sunset)) {
    result = 0.5;
  } else if ((timeOfDay < sunrise) || (timeOfDay > sunset)) {
    result = 0;
  } else {
    result = 1;
  }

  return result;
};

import * as THREE from "three";

export const monthLabel: Record<number, string> = {
  1: "MONTH.JANUARY",
  2: "MONTH.FEBRUARY",
  3: "MONTH.MARCH",
  4: "MONTH.APRIL",
  5: "MONTH.MAY",
  6: "MONTH.JUNE",
  7: "MONTH.JULY",
  8: "MONTH.AUGUST",
  9: "MONTH.SEPTEMBER",
  10: "MONTH.OCTOBER",
  11: "MONTH.NOVEMBER",
  12: "MONTH.DECEMBER",
};

// The only reliable data format is ISO 8601 format. Firefox and Safari is very strict about number format:
// new Date("2022-01-01") is fine, but new Date("2022-1-1") will return an invalid date.
export const formatTimeNumber = (val: number) => ("00" + Math.floor(val)).slice(-2);

export const fractionalHourToTimeString = (hour: number) => {
  const minutes = (hour % 1) * 60;
  const seconds = (minutes % 1) * 60;
  return `${formatTimeNumber(hour)}:${formatTimeNumber(minutes)}:${formatTimeNumber(seconds)}`;
};

export const calculateEquatorialPosition = (radianRA: number,  radianDec: number, radius: number) => {
  const xPos = radius * (Math.sin(radianRA)) * Math.cos(radianDec);
  const yPos = radius * (Math.sin(radianDec));
  const zPos = radius * (Math.cos(radianRA) * Math.cos(radianDec));
  return new THREE.Vector3(xPos, yPos, zPos);
};

export const localSiderealTimeToCelestialSphereRotation = (lst: number) => {
  // const siderealHoursPerDay = 23.9344696;
  const siderealHoursPerDay = 24;
  const fractionOfDay = lst / siderealHoursPerDay;
  return THREE.MathUtils.degToRad(fractionOfDay * 360);
};

export const timeToAMPM = (hour: number) => {
  const time = new Date(`2022-01-01T${fractionalHourToTimeString(hour)}`);
  return time.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

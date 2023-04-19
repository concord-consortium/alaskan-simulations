import * as THREE from "three";
import { Constellation } from "../types";

const constellationAt10PmByMonth: Record<number, Constellation> = {
  1: Constellation.Gemini,
  2: Constellation.Cancer,
  3: Constellation.Leo,
  4: Constellation.Virgo,
  5: Constellation.Libra,
  6: Constellation.Scorpius,
  7: Constellation.Sagittarius,
  8: Constellation.Capricornus,
  9: Constellation.Aquarius,
  10: Constellation.Pisces,
  11: Constellation.Aries,
  12: Constellation.Taurus,
};

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

export const getConstellationAtTargetTime = (month: number) => constellationAt10PmByMonth[month];

// The only reliable data format is ISO 8601 format. Firefox and Safari is very strict about number format:
// new Date("2022-01-01") is fine, but new Date("2022-1-1") will return an invalid date.
export const formatTimeNumber = (val: number) => ("00" + Math.floor(val)).slice(-2);

export const fractionalHourToTimeString = (hour: number) => {
  const minutes = (hour % 1) * 60;
  const seconds = (minutes % 1) * 60;
  return `${formatTimeNumber(hour)}:${formatTimeNumber(minutes)}:${formatTimeNumber(seconds)}`;
};

// Should Spanish version use 24hr format?
export const timeToAMPM = (hour: number, lang: string) => {
  const time = new Date(`2022-01-01T${fractionalHourToTimeString(hour)}`);
  let timeString = time.toLocaleString("en-US", { hour: "numeric", hour12: true });
  if (lang === "es") {
    timeString = timeString.replace(/AM/, "a. m.").replace(/PM/, "p. m.");
  }
  return timeString;
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

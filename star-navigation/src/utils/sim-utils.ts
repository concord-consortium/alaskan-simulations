import * as THREE from "three";
import { toLocalSiderealTime } from "./time-conversion";
import { getStarByHip } from "./star-utils";

export const SIMULATION_YEAR = 2023;

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
  const time = new Date(`${SIMULATION_YEAR}-01-01T${fractionalHourToTimeString(hour)}`);
  return time.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

export const daysInMonth = (month: number) => new Date(SIMULATION_YEAR, month, 0).getDate();

// In year 2023:
// PDT: March 12 <-> November 5
// PST: November 5 <-> March 12
export const getTimezone = (month: number, day: number) => {
  const PDT = "-07:00";
  const PST = "-08:00";
  if (month > 3 || month < 11) {
    return PDT;
  }
  if (month === 3 && day >= 12) {
    return PDT;
  }
  if (month === 11 && day < 5) {
    return PDT;
  }
  return PST;
};

export const getDateTimeString = (month: number, day: number, hour: number) =>
  `${SIMULATION_YEAR}-${formatTimeNumber(month)}-${formatTimeNumber(day)}T${fractionalHourToTimeString(hour)}${getTimezone(month, day)}`;


export const getCelestialSphereRotation = (options: { epochTime: number, lat: number, long: number }): [number, number, number] => {
  const { epochTime, lat, long } = options;
  const date = new Date(epochTime);
  const lst = toLocalSiderealTime(date, long);
  return [ -1 * THREE.MathUtils.degToRad(90 - lat), -1 * localSiderealTimeToCelestialSphereRotation(lst), 0 ];
};

export const invertCelestialSphereRotation = (options: { point: THREE.Vector3, epochTime: number, lat: number, long: number }) => {
  const { point, epochTime, lat, long } = options;
  const eulerRotation = new THREE.Euler(...getCelestialSphereRotation({ epochTime, lat, long }));
  const quaternionInverted = (new THREE.Quaternion().setFromEuler(eulerRotation)).invert();
  point.applyQuaternion(quaternionInverted);
  return point;
};

export const getStarPositionAtTime = (options: { starHip: number, celestialSphereRadius: number, epochTime: number, lat: number, long: number}) => {
  const { starHip, celestialSphereRadius, epochTime, lat, long } = options;
  const star = getStarByHip(starHip);
  const starPos = calculateEquatorialPosition(star.RadianRA, star.RadianDec, celestialSphereRadius);
  const eulerRotation = new THREE.Euler(...getCelestialSphereRotation({ epochTime, lat, long }));
  starPos.applyEuler(eulerRotation);
  return starPos;
};

export const toPositiveHeading = (heading: number) => {
  if (heading < 0) {
    // [-0, -180] range representing N-E-S side
    return -heading;
  }
  // [0, 180] range representing N-W-S side
  return (360 - heading) % 360;
};

export const toNegativeHeading = (heading: number) => {
  // Opposite of toPositiveHeading
  if (heading > 180) {
    // [180, 360] range representing N-E-S side
    return 360 - heading;
  }
  return -heading;
};

export const getStarHeadingFromNorth = (options: { starHip: number, epochTime: number, lat: number, long: number}) => {
  const { starHip, epochTime, lat, long } = options;
  const assumedNorthStarPos = getStarPositionAtTime({
    starHip,
    celestialSphereRadius: 1, // it doesn't matter for heading calculations
    epochTime,
    lat,
    long
  });
  return toPositiveHeading(THREE.MathUtils.radToDeg(Math.atan2(assumedNorthStarPos.x, -assumedNorthStarPos.z)));
};

export const getHeadingFromAssumedNorthStar = (options: { assumedNorthStarHip: number, realHeadingFromNorth: number, epochTime: number, lat: number, long: number}) => {
  const assumedNorthStarHeadingFromNorth = getStarHeadingFromNorth({
    starHip: options.assumedNorthStarHip,
    epochTime: options.epochTime,
    lat: options.lat,
    long: options.long
  });
  return (assumedNorthStarHeadingFromNorth + options.realHeadingFromNorth) % 360;
};

export const getHorizontalFov = (verticalFovInDeg: number, aspectRatio: number) => {
  const verticalFovRad = THREE.MathUtils.degToRad(verticalFovInDeg);
  const horizontalFovRad = 2 * Math.atan(Math.tan(verticalFovRad / 2) * aspectRatio);
  return THREE.MathUtils.radToDeg(horizontalFovRad);
};

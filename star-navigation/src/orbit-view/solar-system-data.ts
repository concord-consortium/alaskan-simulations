import * as THREE from "three";

const AU = 149597870.691;
const AU_2_KM = 149597870.7;
const EARTH_ECCENTRICITY = 0.01671123;
const RAD_2_DEG = 180 / Math.PI;

export const SCALE_FACTOR = 100000;
export const EARTH_ORBITAL_RADIUS = AU / SCALE_FACTOR;
export const EARTH_SEMI_MAJOR_AXIS = 1.00000261;
export const SUN_FOCUS = EARTH_ECCENTRICITY / EARTH_SEMI_MAJOR_AXIS / 2 * AU_2_KM / SCALE_FACTOR;
export const EARTH_TILT = 0.41;
export const SUMMER_SOLSTICE = 171; // 171 day of year

export function earthEllipseLocationByDay(day: any) {
  const index = (SUMMER_SOLSTICE - day) / 365;
  let z = (1 / EARTH_SEMI_MAJOR_AXIS) * Math.sin(index * 2 * Math.PI);
  let x = EARTH_SEMI_MAJOR_AXIS * Math.cos(index * 2 * Math.PI);

  x = x * EARTH_ORBITAL_RADIUS + SUN_FOCUS * 2;
  z = z * EARTH_ORBITAL_RADIUS;

  return new THREE.Vector3(x, 0, z);
}

export function sunRayAngle(day: number, earthTilt: number, lat: number) {
  // Angle of tilt axis, looked at from above (i.e., projected onto xy plane).
  // June solstice = 0, September equinox = pi/2, December solstice = pi, March equinox = 3pi/2.
  const tiltAxisZRadians = 2 * Math.PI * (day - SUMMER_SOLSTICE) / 365;
  // How much is a given latitude tilted up (+) or down (-) toward the ecliptic?
  // -23.5 degrees on June solstice, 0 degrees at equinoxes, +23.5 degrees on December solstice.
  const orbitalTiltDegrees = earthTilt ? EARTH_TILT * RAD_2_DEG : 0;
  const effectiveTiltDegrees = -Math.cos(tiltAxisZRadians) * orbitalTiltDegrees;
  return 90 - (lat + effectiveTiltDegrees);
}

export function angleToDay(angle: number, earthTilt: number, lat: number) {
  // Inverse sunRayAngle function.
  // If you write out math equation, you can convert sunRayAngle to formula below:
  // angle = 90 - lat + Math.cos(2 * Math.PI * (day - SUMMER_SOLSTICE) / 365) * orbitalTiltDegrees
  // (angle - 90 + lat) / orbitalTiltDegrees = Math.cos(2 * Math.PI * (day - SUMMER_SOLSTICE) / 365)
  // Math.acos((angle - 90 + lat) / orbitalTiltDegrees)) = 2 * Math.PI * (day - SUMMER_SOLSTICE) / 365
  // 365 * Math.acos((angle - 90 + lat) / orbitalTiltDegrees)) = 2 * Math.PI * (day - SUMMER_SOLSTICE)
  // day - SUMMER_SOLSTICE = 365 * Math.acos((angle - 90 + lat) / orbitalTiltDegrees)) / (2 * Math.PI)
  const orbitalTiltDegrees = earthTilt ? EARTH_TILT * RAD_2_DEG : 0;
  const distFromSolstice =  365 * Math.acos((angle - 90 + lat) / orbitalTiltDegrees) / (2 * Math.PI);
  if (isNaN(distFromSolstice)) {
    return null;
  }
  return {day1: SUMMER_SOLSTICE - distFromSolstice, day2: SUMMER_SOLSTICE + distFromSolstice};
}

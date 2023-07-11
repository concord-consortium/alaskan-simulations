
import { applyURLParams } from "common";

// Simulation configuration that can be overwritten using URL parameters.
export interface IConfig {
  // `undefined` (based on browser local setting) or ISO 639-1 Language Code
  // for the given language (i.e., `es` for Spanish or `de` for German).
  lang: string | undefined;
  // Horizon view camera FOV.
  horizonFov: number;
  // Horizon view camera angle.
  horizonCameraAngle: number; // deg
  // Star size multiple, both orbit and horizon view.
  starSizeMult: number;
  // Minium constellation star size, both orbit and horizon view.
  minConstellationStarSize: number;
  // Minium constellation star size, both orbit and horizon view.
  maxConstellationStarSize: number;
  // Minimum absolute star magnitude needed for star to be shown in both views
  minAbsStarMagnitude: number;

  constellations: string;
  constellationsOpacity: number;

  // Whether to show the route map on the right side of the star map.
  routeMap: boolean;
}

const defaultConfig: IConfig = {
  lang: undefined,
  horizonFov: 100,
  horizonCameraAngle: 39, // deg
  starSizeMult: 0.5,
  minConstellationStarSize: 9,
  maxConstellationStarSize: 10,
  minAbsStarMagnitude: 3,
  constellations: "",
  constellationsOpacity: 0.5,
  routeMap: false
};

// Config is cached when module is loaded. That's fine, as URL parameters will not change in normal situation.
export const config: IConfig = applyURLParams(defaultConfig);

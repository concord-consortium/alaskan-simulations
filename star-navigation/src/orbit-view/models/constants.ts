import * as data from "../solar-system-data";

// This constants define values used by 3D object, they don't have any physical meaning.

export const SF = 1 / data.SCALE_FACTOR;

export const EARTH_RADIUS = 7000000 * SF;
export const SIMPLE_EARTH_RADIUS = 18000000 * SF;
export const SUN_RADIUS = 4000000 * SF;
export const SIMPLE_SUN_RADIUS = 15000000 * SF;

export const LAT_LINE_THICKNESS = 0.01;

export const SUN_COLOR = 0xCB671F;
export const HIGHLIGHT_COLOR = 0xff0000;
export const HIGHLIGHT_EMISSIVE = 0xbb3333;

export const SEASON_LABEL_SIZE = 11000000 * SF;

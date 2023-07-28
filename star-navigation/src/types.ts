import { IRuntimeInteractiveMetadata } from "@concord-consortium/lara-interactive-api";

export enum Constellation {
  // Translation keys should match the values.
  Virgo = "CONSTELLATION.VIRGO",
  Libra = "CONSTELLATION.LIBRA",
  Scorpius = "CONSTELLATION.SCORPIUS",
  Aries = "CONSTELLATION.ARIES",
  Taurus = "CONSTELLATION.TAURUS",
  Gemini = "CONSTELLATION.GEMINI",
  Cancer = "CONSTELLATION.CANCER",
  Leo = "CONSTELLATION.LEO",
  Sagittarius = "CONSTELLATION.SAGITTARIUS",
  Capricornus = "CONSTELLATION.CAPRICORNUS",
  Aquarius = "CONSTELLATION.AQUARIUS",
  Pisces = "CONSTELLATION.PISCES",
  Orion = "CONSTELLATION.ORION",
  UrsaMajor = "CONSTELLATION.URSA_MAJOR",
  Aquila = "CONSTELLATION.AQUILA",
}

export const Month: Record<number, string> = {
  // Translation keys should match the values.
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

export interface IStarData {
  Hip: number; // Hipparcos catalog number
  "Const-abbreviations": string;
  "Const-names": string;
  "ProperName": string;
  "B-F-ID": string;
  "F-ID": string;
  "B-ID": string;
  RA: number;
  RadianRA: number;
  Dec: number;
  RadianDec: number;
  Distance: number;
  Mag: number;
  AbsMag: number;
  Spectrum: string;
  ColorIndex: number;
}

export interface IAngleMarker {
  startPoint: [number, number, number]; // [x, y, z]
  endPoint: [number, number, number] | null; // [x, y, z]
  createdAtEpoch: number;
}

export const SNAPSHOT_REQUESTED = "snapshot-requested";

export interface ISnapshot {
  month: number;
  day: number;
  timeOfDay: number; // [0, 24]
  assumedNorthStarHip: number;
  realHeadingFromNorth: number;
  starViewImageSnapshot: string;
}

export interface IModelInputState {
  month: number;
  day: number;
  timeOfDay: number; // [0, 24]
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
  realHeadingFromNorth: number; // degree
  assumedNorthStarHip: number | null;
  angleMarker: IAngleMarker | null;
  pointADepartureSnapshot: ISnapshot | null;
  pointBArrivalSnapshot: ISnapshot | null;
  pointBDepartureSnapshot: ISnapshot | null;
  pointCArrivalSnapshot: ISnapshot | null;
  journeyLeg: "AtoB" | "BtoC";
  pointB: { x: number, y: number };
  showUserTrip: boolean;
  // interactions
  compassInteractionActive: boolean;
  angleMarkerInteractionActive: boolean;
}

export interface IModelOutputState {
}

export interface IInteractiveState extends IRuntimeInteractiveMetadata {
  inputState: IModelInputState,
  readAloudMode: boolean
}

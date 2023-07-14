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

export enum Month {
  // Translation keys should match the values.
  January = "MONTH.JANUARY",
  February = "MONTH.FEBRUARY",
  March = "MONTH.MARCH",
  April = "MONTH.APRIL",
  May = "MONTH.MAY",
  June = "MONTH.JUNE",
  July = "MONTH.JULY",
  August = "MONTH.AUGUST",
  September = "MONTH.SEPTEMBER",
  October = "MONTH.OCTOBER",
  November = "MONTH.NOVEMBER",
  December = "MONTH.DECEMBER",
}

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

export interface IModelInputState {
  month: number;
  day: number;
  timeOfDay: number; // [0, 24]
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
  compassActive: boolean;
  selectedStarHip: number | null;
}

export interface IModelOutputState {
}

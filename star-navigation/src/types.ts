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

export interface IModelInputState {
  month: number;
  day: number;
  timeOfDay: number; // [0, 24]
}

export interface IModelOutputState {
}

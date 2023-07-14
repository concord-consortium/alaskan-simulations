import allStars from "../data/CEASAR-HYG-for-import-9k.csv";
import constellations from "../data/constellations.csv";
import { config } from "../config";
import { IStarData } from "../types";

let starInConstellation: Record<number, boolean | undefined>;
export const isStarInConstellation = (starHip: number) => {
  if (!starInConstellation) {
    starInConstellation = {};
    constellations.forEach((constellation: any) => {
      constellation.__parsed_extra.forEach((starId: number) => {
        starInConstellation[starId] = true;
      });
    });
  }
  return starInConstellation[starHip];
};

let filteredStars: IStarData[];
export const getFilteredStars = () => {
  if (!filteredStars) {
    filteredStars = (allStars as IStarData[]).filter(star =>
      isStarInConstellation(star.Hip) || star.AbsMag >= config.minAbsStarMagnitude
    );
  }
  return filteredStars;
};

let starByHip: Record<number, IStarData>;
export const getStarByHip = (starHip: number) => {
  if (!starByHip) {
    starByHip = {};
    getFilteredStars().forEach(star => {
      starByHip[star.Hip] = star;
    });
  }
  return starByHip[starHip];
};

let constellationStars: IStarData[];
export const getConstellationStars = () => {
  if (!constellationStars) {
    constellationStars = [];
    getFilteredStars().forEach(star => {
      if (isStarInConstellation(star.Hip)) {
        constellationStars.push(star);
      }
    });
  }
  return constellationStars;
};

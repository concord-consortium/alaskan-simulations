import React from "react";
import clsx from "clsx";
import { CO2Amount } from "../../../types";
import css from "./animation-view.scss";

interface IProps {
  soil: boolean;
  water: boolean;
  co2Amount: CO2Amount;
  time: number;
  isRunning: boolean;
}

export const AnimationView: React.FC<IProps> = ({soil, water, co2Amount, time, isRunning}) => {
  const co2None = (co2Amount === CO2Amount.No);
  const co2Low = (co2Amount === CO2Amount.Low);
  const co2Normal = (co2Amount === CO2Amount.Normal);
  let plantClass = "";
  let rootClass = "";

  if (time >= 0 && time <= 0.142){ // Day 00
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay00]: (water && co2Normal),
      [css.lessGrowthLeavesDay00]: (water && co2Low),
      [css.noGrowthYellowLeavesDay00]: (water && co2None),
      [css.noGrowthWiltedLeavesDay00]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay00]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay00]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay00]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay00]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay00]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay00]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.142 && time <= 0.285){ // Day 04
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay04]: (water && co2Normal),
      [css.lessGrowthLeavesDay04]: (water && co2Low),
      [css.noGrowthYellowLeavesDay04]: (water && co2None),
      [css.noGrowthWiltedLeavesDay04]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay04]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay04]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay04]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay04]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay04]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay04]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.285 && time <= 0.428){ // Day 08
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay08]: (water && co2Normal),
      [css.lessGrowthLeavesDay08]: (water && co2Low),
      [css.noGrowthYellowLeavesDay08]: (water && co2None),
      [css.noGrowthWiltedLeavesDay08]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay08]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay08]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay08]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay08]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay08]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay08]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.428 && time <= 0.571){ // Day 12
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay12]: (water && co2Normal),
      [css.lessGrowthLeavesDay12]: (water && co2Low),
      [css.noGrowthYellowLeavesDay12]: (water && co2None),
      [css.noGrowthWiltedLeavesDay12]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay12]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay12]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay12]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay12]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay12]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay12]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.571 && time <= 0.714){ // Day 16
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay16]: (water && co2Normal),
      [css.lessGrowthLeavesDay16]: (water && co2Low),
      [css.noGrowthYellowLeavesDay16]: (water && co2None),
      [css.noGrowthWiltedLeavesDay16]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay16]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay16]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay16]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay16]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay16]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay16]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.714 && time <= 0.857){ // Day 20
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay20]: (water && co2Normal),
      [css.lessGrowthLeavesDay20]: (water && co2Low),
      [css.noGrowthYellowLeavesDay20]: (water && co2None),
      [css.noGrowthWiltedLeavesDay20]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay20]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay20]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay20]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay20]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay20]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay20]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.857 && time <= 0.995){ // Day 24
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay24]: (water && co2Normal),
      [css.lessGrowthLeavesDay24]: (water && co2Low),
      [css.noGrowthYellowLeavesDay24]: (water && co2None),
      [css.noGrowthWiltedLeavesDay24]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay24]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay24]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay24]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay24]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay24]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay24]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

  if (time > 0.995 && time <= 1){ // Day 28
    plantClass = clsx(css.animationImage, {
      [css.growthLeavesDay28]: (water && co2Normal),
      [css.lessGrowthLeavesDay28]: (water && co2Low),
      [css.noGrowthYellowLeavesDay28]: (water && co2None),
      [css.noGrowthWiltedLeavesDay28]: (soil && !water && (co2Normal || co2Low)),
      [css.noGrowthWiltedAltLeavesDay28]: (!soil && !water && (co2Normal || co2Low)),
      [css.noGrowthYellowWiltedLeavesDay28]: (soil && !water && co2None),
      [css.noGrowthYellowWiltedAltLeavesDay28]: (!soil && !water && co2None),
    });
    rootClass = clsx(css.animationImage, {
      [css.growthRootsDay28]: (!soil && water && co2Normal),
      [css.lessGrowthRootsDay28]: (!soil && water && co2Low),
      [css.noGrowthAltRootsDay28]: (!soil && co2None) || (!soil && !water && co2Low) || (!soil && !water && co2Normal),
    });
  }

    return (
      <div className={css.viewContainer}>
        <div className={plantClass}/>
        <div className={rootClass}/>
      </div>
    );
};


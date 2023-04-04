import React from "react";
import clsx from "clsx";
import { InputAmount } from "../../../types";
import css from "./animation-view.scss";

interface IProps {
  light: InputAmount;
  water: InputAmount;
  co2Amount: InputAmount;
  time: number;
  isRunning: boolean;
}

export const AnimationView: React.FC<IProps> = ({light, water, co2Amount, time, isRunning}) => {

  const noLight = (light === InputAmount.None);
  const fullWater = (water === InputAmount.Full);
  const co2None = (co2Amount === InputAmount.None);
  const co2Low = (co2Amount === InputAmount.Some);
  const fullCo2 = (co2Amount === InputAmount.Full);
  let plantClass = "";
  let rootClass = "";

  if (time >= 0 && time <= 0.142){ // Day 00
    plantClass = clsx(css.animationImage, css.day0);
  }

  if (time > 0.142 && time <= 0.285){ // Day 04
    plantClass = clsx(css.animationImage, {
      [css.case1day4]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.285 && time <= 0.428){ // Day 08
    plantClass = clsx(css.animationImage, {
      [css.case1day8]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.428 && time <= 0.571){ // Day 12
    plantClass = clsx(css.animationImage, {
      [css.case1day12]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.571 && time <= 0.714){ // Day 16
    plantClass = clsx(css.animationImage, {
      [css.case1day16]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.714 && time <= 0.857){ // Day 20
    plantClass = clsx(css.animationImage, {
      [css.case1day20]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.857 && time <= 0.995){ // Day 24
    plantClass = clsx(css.animationImage, {
      [css.case1day24]: (noLight && fullWater && fullCo2),
    });
  }

  if (time > 0.995 && time <= 1){ // Day 28
    plantClass = clsx(css.animationImage, {
      [css.case1day28]: (noLight && fullWater && fullCo2),
    });
  }

  console.log("plantClass", plantClass);

    return (
      <div className={css.viewContainer}>
        <div className={plantClass}/>
      </div>
    );
};


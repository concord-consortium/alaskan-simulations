import React from "react";
import clsx from "clsx";
import { InputAmount } from "../../types";
import css from "./animation-view.scss";

interface IProps {
  light: InputAmount;
  water: InputAmount;
  co2Amount: InputAmount;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({light, water, co2Amount, time, isRunning, isFinished}) => {
  const noLight = (light === InputAmount.None);
  const someLight = (light === InputAmount.Some);
  const fullLight = (light === InputAmount.Full);

  const noWater = (water === InputAmount.None);
  const someWater = (water === InputAmount.Some);
  const fullWater = (water === InputAmount.Full);

  const noCo2 = (co2Amount === InputAmount.None);
  const someCo2 = (co2Amount === InputAmount.Some);
  const fullCo2 = (co2Amount === InputAmount.Full);

  let plantClass = "";

  // Cases 7, 8, 9, 16, 17, 18, 25, 26, 27
  const isNoGrowthCase = noWater;
  // Cases 1, 4, 10
  const isCase1OrSame = (noLight && fullWater && fullCo2) || (noLight && someWater && fullCo2) || (noLight && fullWater && someCo2);
  // Cases 2, 6
  const isCase2OrSame = (someLight && fullWater && fullCo2) || (fullLight && someWater && fullCo2);
  // Cases 13, 19, 20, 21, 22, 23, 24
  const isCase13OrSame = (noLight && someWater && someCo2) || (!noWater && noCo2);
  // Cases 14, 15
  const isCase14OrSame = (someWater && someLight && someCo2) || (fullLight && someWater && someCo2);

  const isCase3 = fullLight && fullWater && fullCo2;
  const isCase5 = someLight && someWater && fullCo2;
  const isCase11 = someLight && fullWater && someCo2;
  const isCase12 = fullLight && fullWater && someCo2;

  if (time >= 0 && time <= 0.142){ // Day 00
    plantClass = clsx(css.day0);
  }

  if (time > 0.142 && time <= 0.285){ // Day 04
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day4]: isCase1OrSame || isCase13OrSame,
      [css.case2day4]: isCase2OrSame || isCase5 || isCase11 || isCase14OrSame,
      [css.case3day4]: isCase3 || isCase12
    });
  }

  if (time > 0.285 && time <= 0.428){ // Day 08
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day8]: isCase1OrSame,
      [css.case2day8]: isCase2OrSame || isCase11,
      [css.case3day8]: isCase3,
      [css.case5day8]: isCase5 || isCase14OrSame,
      [css.case12day8]: isCase12,
      [css.case13day8]: isCase13OrSame
    });
  }

  if (time > 0.428 && time <= 0.571){ // Day 12
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day12]: isCase1OrSame,
      [css.case2day12]: isCase2OrSame || isCase11,
      [css.case3day12]: isCase3,
      [css.case5day12]: isCase5,
      [css.case12day12]: isCase12,
      [css.case13day12]: isCase13OrSame,
      [css.case14day12]: isCase14OrSame
    });
  }

  if (time > 0.571 && time <= 0.714){ // Day 16
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day16]: isCase1OrSame,
      [css.case2day16]: isCase2OrSame || isCase11,
      [css.case3day16]: isCase3,
      [css.case5day16]: isCase5,
      [css.case12day16]: isCase12,
      [css.case13day12]: isCase13OrSame,
      [css.case14day16]: isCase14OrSame

    });
  }

  if (time > 0.714 && time <= 0.857){ // Day 20
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day20]: isCase1OrSame,
      [css.case2day20]: isCase2OrSame || isCase11,
      [css.case3day20]: isCase3,
      [css.case5day20]: isCase5,
      [css.case12day20]: isCase12,
      [css.case13day12]: isCase13OrSame,
      [css.case14day20]: isCase14OrSame

    });
  }

  if (time > 0.857 && time <= 0.995){ // Day 24
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day24]: isCase1OrSame,
      [css.case2day24]: isCase2OrSame,
      [css.case3day24]: isCase3,
      [css.case5day24]: isCase5,
      [css.case2day28]: isCase11,
      [css.case12day24]: isCase12,
      [css.case13day12]: isCase13OrSame,
      [css.case14day24]: isCase14OrSame

    });
  }

  if (time > 0.995 && time <= 1){ // Day 28
    plantClass = clsx({
      [css.day0]: isNoGrowthCase,
      [css.case1day24]: isCase1OrSame,
      [css.case2day28]: isCase2OrSame,
      [css.case3day28]: isCase3,
      [css.case5day28]: isCase5,
      [css.case11day28]: isCase11,
      [css.case12day28]: isCase12,
      [css.case13day12]: isCase13OrSame,
      [css.case14day28]: isCase14OrSame
    });
  }

    return (
      <div className={css.viewContainer}>
        <div className={clsx(css.animationImage, plantClass)}>
          <div className={clsx(css.heightLine, {[css.visible] : isRunning || isFinished})}/>
        </div>
      </div>
    );
};


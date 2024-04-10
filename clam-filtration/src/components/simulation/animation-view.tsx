import React from "react";
import clsx from "clsx";
import { EQualitativeAmount } from "../../types";
import css from "./animation-view.scss";

interface IProps {
  algaeStart: EQualitativeAmount;
  numClams: number;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeStart, numClams, time, isRunning, isFinished}) => {
    return (
      <div className={css.viewContainer}>
        <div className={clsx(css.animationImage)}>
          <div className={clsx(css.heightLine, {[css.visible] : isRunning || isFinished})}/>
        </div>
      </div>
    );
};


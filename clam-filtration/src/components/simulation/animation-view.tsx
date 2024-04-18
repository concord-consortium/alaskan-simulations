import React from "react";
import clsx from "clsx";
import { Amount } from "../../types";
import css from "./animation-view.scss";

interface IProps {
  algaeStart: Amount;
  numClams: Amount;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeStart, numClams, time, isRunning, isFinished}) => {
    return (
      <div className={css.viewContainer}>
        <div className={clsx(css.animationImage)}>
          <div className={clsx({[css.visible] : isRunning || isFinished})}/>
        </div>
      </div>
    );
};


import React from "react";
import { IModelInputState, IModelOutputState } from "../../types";
import { AnimationView } from "./animation-view";
import { useTranslation } from "common";

import css from "./simulation-view.scss";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  isRunning: boolean;
  isFinished: boolean;
  readOnly?: boolean;
}


export const SimulationView: React.FC<IProps> = ({ input, output, isRunning, isFinished, readOnly }) => {
  const { t } = useTranslation();
  const {algaeStart, numClams} = input;

  return (
    <div className={css.simulationView}>
      <div className={css.tempLabel}>{t("WATER_TEMP")} {47}°F</div>
      <AnimationView algaeStart={algaeStart} numClams={numClams} time={output.time} isRunning={isRunning} isFinished={isFinished}/>
    </div>
  );
};

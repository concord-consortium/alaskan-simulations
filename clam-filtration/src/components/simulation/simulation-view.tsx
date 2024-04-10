import clsx from "clsx";
import React from "react";
import { IModelInputState, IModelOutputState } from "../../types";
import { AnimationView } from "./animation-view";
import { LabeledContainer } from "../containers/labeled-container";
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
    <LabeledContainer className={css.simulationView} label={t("Clam Filtration")}>
    <div className={css.terrariumBackGround}/>
      <div className={css.terrarium}>
        <div className={css.tempLabel}>
          <div className={css.tempLabelText}> <span>Water Temp:</span> {47}°F</div>
        </div>
      </div>
      <AnimationView algaeStart={algaeStart} numClams={numClams} time={output.time} isRunning={isRunning} isFinished={isFinished}/>
    </LabeledContainer>
  );
};

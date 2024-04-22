import React from "react";
import { Amount, IModelInputState, IModelOutputState } from "../../types";
import { AnimationView } from "./animation-view";
import { useTranslation } from "common";
import { outputData } from "../../utils/data";

import css from "./simulation-view.scss";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  month: string;
  isRunning: boolean;
  isFinished: boolean;
  readOnly?: boolean;
}


export const SimulationView: React.FC<IProps> = ({ input, output, month, isRunning, isFinished, readOnly }) => {
  const { t } = useTranslation();
  const {algaeStart, numClams} = input;
  const algaeLevels = [Amount.Low, Amount.Medium, Amount.High];
  const algaeLevelText = ["Low", "Medium", "High"];
  const clamDensities = [1, 5, 8];
  const monthlyWaterTemps: Record<string, number> = {"May": 35, "June": 40, "July": 45, "August": 40, "September": 37};
  const dataOutput = outputData[`${algaeLevelText[algaeStart]}${clamDensities[numClams]}`];
  const dataForMonth = !isRunning && !isFinished ? dataOutput?.find(data => data.month === "May")
                                  : dataOutput?.find(data => data.month === month);
  const turbidity = dataForMonth?.output?.turbidity || 0;
  return (
    <div className={css.simulationView}>
      <div className={css.tempLabel}>
        {t("WATER_TEMP")} {` ${monthlyWaterTemps[month]}°F`}
      </div>
      <AnimationView algaeLevel={algaeLevels[algaeStart]} numClams={clamDensities[numClams]}
                      time={output.time} turbidity={turbidity} isRunning={isRunning}
                      isFinished={isFinished}/>
    </div>
  );
};

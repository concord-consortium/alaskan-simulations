import React from "react";
import { Amount, IModelInputState } from "../../types";
import { useTranslation } from "common";
import { TCaseOutputData, clamDensitiesToShow } from "../../utils/data";
import { AnimationView } from "./animation-view";

import css from "./simulation-view.scss";

interface IProps {
  input: IModelInputState
  month: string;
  dataOutput: TCaseOutputData;
  isRunning: boolean;
  isFinished: boolean;
  readOnly?: boolean;
}


export const SimulationView: React.FC<IProps> = ({ input, month, dataOutput, isRunning, isFinished, readOnly }) => {
  const { t } = useTranslation();
  const {algaeStart, numClams} = input;
  const algaeLevels = [Amount.Low, Amount.Medium, Amount.High];
  const monthlyWaterTemps: Record<string, number> = {"May": 35, "June": 40, "July": 45, "August": 40, "September": 37};
  const dataForMonth = !isRunning && !isFinished ? dataOutput?.find(data => data.month === "May")
                                  : dataOutput?.find(data => data.month === month);
  const turbidity = dataForMonth?.output?.turbidity || 0;
  const nitrate = dataForMonth?.output?.nitrate || 0;
  return (
    <div className={css.simulationView}>
      <div className={css.tempLabel}>
        {t("WATER_TEMP")} {` ${monthlyWaterTemps[month]}°F`}
      </div>
      {/* Pass in algaeLevel at algaeStart so we know what background class to before animation starts*/}
      <AnimationView algaeLevel={algaeLevels[algaeStart]} numClams={clamDensitiesToShow[numClams]}
                      turbidity={turbidity} nitrate={nitrate} isRunning={isRunning} isFinished={isFinished}/>
    </div>
  );
};

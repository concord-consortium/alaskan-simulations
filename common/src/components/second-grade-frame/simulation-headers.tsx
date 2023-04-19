import React from "react";
import { t } from "common";
import { ExperimentButtons } from "./experiment-buttons";

import css from "./simulation-headers.scss";

interface IProps {
  isRunning: boolean;
  activeRunIdx: number;
  onChangeRunIdx: (runIdx: number) => void;
}

export const SimulationHeaders: React.FC<IProps> = ({isRunning, activeRunIdx, onChangeRunIdx}) => {
  return (
    <div className={css.simulationHeaders}>
      <div className={css.title}>{t("EXPERIMENT")}</div>
      <ExperimentButtons disabled={isRunning} activeRunIdx={activeRunIdx} onChangeRunIdx={onChangeRunIdx} />
    </div>
  );
};

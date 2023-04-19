
import React from "react";
import { SimulationFrame, SimulationHeaders } from "common";
import { Controls } from "./simulation-controls";

import css from "./second-grade-frame.scss";

interface IProps {
  title: string;
  directions: string | JSX.Element;
  isRunning: boolean;
  activeRunIdx: number;
  playButtonDisabled: boolean;
  onChangeRunIdx: (idx: number) => void;
  focusTargetAfterNewRun: React.RefObject<HTMLButtonElement>;
  onStartSimulation: () => void;
  SimulationView: JSX.Element;
  TimeTrack: JSX.Element;
  BottomControls: JSX.Element;
  Labbook: JSX.Element;
}

export const SecondGradeFrame: React.FC<IProps> = (props) => {
  const { title, directions, isRunning, activeRunIdx, playButtonDisabled, onChangeRunIdx, focusTargetAfterNewRun,
    onStartSimulation, SimulationView, TimeTrack, BottomControls, Labbook } = props;

  return (
    <SimulationFrame
      title={title}
      directions={directions}
      largerStyle={true}
    >
      <div className={css.content}>
        <div className={css.simulationContainer}>
          <SimulationHeaders isRunning={isRunning} activeRunIdx={activeRunIdx} onChangeRunIdx={onChangeRunIdx} />
          <div className={css.simulationView}>
            { SimulationView }
          </div>
          <Controls
            playButtonDisabled={playButtonDisabled}
            focusTargetAfterNewRun={focusTargetAfterNewRun}
            onStartSimulation={onStartSimulation}
            TimeTrack={TimeTrack}
          />
          { BottomControls }
        </div>
        { Labbook }
      </div>
    </SimulationFrame>
  );
};

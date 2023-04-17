import { PlayButton } from "common";
import React from "react";

import css from "./simulation-controls.scss";

interface IProps {
  playButtonDisabled: boolean,
  onStartSimulation: () => void,
  focusTargetAfterNewRun: React.Ref<HTMLButtonElement>,
  TimeTrack: JSX.Element;
}

export const Controls: React.FC<IProps> = ({ playButtonDisabled, focusTargetAfterNewRun, onStartSimulation, TimeTrack }) => {
  return (
    <div className={css.controls}>
      <div className={css.playButton}>
        <PlayButton
          ref={focusTargetAfterNewRun}
          onClick={onStartSimulation}
          disabled={playButtonDisabled}
          largerStyle={true}
        />
      </div>
      <div className={css.timeControls}>
        { TimeTrack }
      </div>
    </div>
  );
};

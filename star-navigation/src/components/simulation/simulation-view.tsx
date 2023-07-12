import React from "react";
import { IModelInputState } from "../../types";
import { StarView } from "../star-view/star-view";
import { daytimeOpacity } from "../../utils/daytime";

import css from "./simulation-view.scss";

interface IProps {
  epochTime: number;
  observerLat: number;
  observerLon: number;
  inputState: IModelInputState;
}

export const SimulationView: React.FC<IProps> = ({ inputState, epochTime, observerLat, observerLon }) => {
  return (
    <div className={css.simulationView}>
      <div className={css.horizonViewWrapper}>
        <div className={css.sky} />
        <div className={css.stars}>
          <StarView
            epochTime={epochTime}
            lat={observerLat}
            long={observerLon}
            showWesternConstellations={inputState.showWesternConstellations}
            showYupikConstellations={inputState.showYupikConstellations}
          />
        </div>
        <div className={css.daylight} style={{ opacity: daytimeOpacity(inputState) }} />
        <div className={css.landscape} />
      </div>
    </div>
  );
};

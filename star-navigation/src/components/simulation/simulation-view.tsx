import React from "react";
import { HorizonViewWrapper } from "../../horizon-view/components/horizon-view-wrapper";
import { IModelInputState } from "../../types";
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
      <div className={css.horizonView}>
        <HorizonViewWrapper
          epochTime={epochTime}
          lat={observerLat}
          long={observerLon}
          showWesternConstellations={inputState.showWesternConstellations}
          showYupikConstellations={inputState.showYupikConstellations}
          daylightOpacity={daytimeOpacity(inputState)}
        />
      </div>
    </div>
  );
};

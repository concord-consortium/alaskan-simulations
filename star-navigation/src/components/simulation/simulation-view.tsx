import React from "react";
import { IModelInputState } from "../../types";
import { StarView } from "../star-view/star-view";
import { daytimeOpacity } from "../../utils/daytime";
import { getHeadingFromAssumedNorthStar } from "../../utils/sim-utils";
import { clsx } from "clsx";

import css from "./simulation-view.scss";

interface IProps {
  epochTime: number;
  observerLat: number;
  observerLon: number;
  inputState: IModelInputState;
  setInputState: (inputState: Partial<IModelInputState>) => void;
}

export const SimulationView: React.FC<IProps> = ({ inputState, setInputState, epochTime, observerLat, observerLon }) => {
  const handleStarClick = (starHip: number) => {
    setInputState({ selectedStarHip: starHip });
  };

  const handleRealHeadingFromNorthChange = (realHeadingFromNorth: number) => {
    setInputState({ realHeadingFromNorth });
  };

  let headingFromAssumedNorthStar;
  if (inputState.selectedStarHip) {
    headingFromAssumedNorthStar = getHeadingFromAssumedNorthStar({
      assumedNorthStarHip: inputState.selectedStarHip,
      realHeadingFromNorth: inputState.realHeadingFromNorth,
      epochTime,
      lat: observerLat,
      long: observerLon
    });
  }

  return (
    <div className={css.simulationView}>
      <div className={css.horizonViewWrapper}>
        <div className={css.sky} />
        <div className={clsx(css.stars, { [css.interactive]: inputState.compassActive })}>
          <StarView
            epochTime={epochTime}
            lat={observerLat}
            long={observerLon}
            showWesternConstellations={inputState.showWesternConstellations}
            showYupikConstellations={inputState.showYupikConstellations}
            onStarClick={handleStarClick}
            selectedStarHip={inputState.selectedStarHip}
            compassActive={inputState.compassActive}
            onRealHeadingFromNorthChange={handleRealHeadingFromNorthChange}
          />
        </div>
        <div className={css.daylight} style={{ opacity: daytimeOpacity(inputState) }} />
        <div className={css.landscape} />
        {
          headingFromAssumedNorthStar !== undefined &&
          <div className={css.heading}>
            Heading: {Math.round(headingFromAssumedNorthStar) % 360}° from North
          </div>
        }
      </div>
    </div>
  );
};

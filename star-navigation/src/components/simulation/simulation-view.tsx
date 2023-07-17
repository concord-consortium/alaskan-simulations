import React from "react";
import { IModelInputState } from "../../types";
import { StarView } from "../star-view/star-view";
import { daytimeOpacity } from "../../utils/daytime";
import { getHeadingFromAssumedNorthStar } from "../../utils/sim-utils";
import BackIcon from "../../assets/back-icon.svg";
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

  const handleRotateLeft = () => {
    setInputState({ realHeadingFromNorth: (inputState.realHeadingFromNorth - 5 + 360) % 360 });
  };

  const handleRotateRight = () => {
    setInputState({ realHeadingFromNorth: (inputState.realHeadingFromNorth + 5) % 360 });
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
            realHeadingFromNorth={inputState.realHeadingFromNorth}
            onRealHeadingFromNorthChange={handleRealHeadingFromNorthChange}
          />
        </div>
        <div className={css.daylight} style={{ opacity: daytimeOpacity(inputState) }} />
        <div className={css.landscape} />
        {
          headingFromAssumedNorthStar !== undefined &&
          <div className={css.heading}>
            {/* % 360 is necessary because of the Math.round (eg. 359.5 will become 360) */}
            Heading: {Math.round(headingFromAssumedNorthStar) % 360}° from North
          </div>
        }
        <div className={css.buttons}>
          <div className={css.buttonContainer}>
            <div>-5°</div>
            <button onClick={handleRotateLeft}><BackIcon /></button>
          </div>
          <div className={css.buttonContainer}>
            <div>+5°</div>
            <button onClick={handleRotateRight}><BackIcon style={{transform: "rotate(180deg)"}} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

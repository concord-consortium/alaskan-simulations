import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { clsx } from "clsx";
import { IModelInputState } from "../../types";
import { StarView } from "../star-view/star-view";
import { daytimeOpacity } from "../../utils/daytime";
import { getHeadingFromAssumedNorthStar, invertCelestialSphereRotation } from "../../utils/sim-utils";
import { Landscape } from "./landscape";

import BackIcon from "../../assets/back-icon.svg";

import css from "./simulation-view.scss";

interface IProps {
  epochTime: number;
  observerLat: number;
  observerLon: number;
  inputState: IModelInputState;
  setInputState: (inputState: Partial<IModelInputState>) => void;
}

export const SimulationView: React.FC<IProps> = ({ inputState, setInputState, epochTime, observerLat, observerLon }) => {
  const starViewRef = useRef<HTMLDivElement>(null);
  const [ starViewAspectRatio, setStarViewAspectRatio ] = useState<number>(0);

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

  const handleMarkerStartPointChange = (startPoint: THREE.Vector3) => {
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: startPoint, epochTime, lat: observerLat, long: observerLon
    });
    setInputState({
      angleMarker: {
        startPoint: pointWithoutRotation.toArray(),
        endPoint: null,
        createdAtEpoch: epochTime
      }
    });
  };

  const handleMarkerEndPointChange = (endPoint: THREE.Vector3) => {
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: endPoint, epochTime, lat: observerLat, long: observerLon
    });
    setInputState({
      angleMarker: {
        startPoint: inputState.angleMarker?.startPoint || [0, 0, 0], // [0, 0, 0] is a fallback to make TS happy, it should never happen
        endPoint: pointWithoutRotation.toArray(),
        createdAtEpoch: epochTime
      }
    });
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

  useEffect(() => {
    if (starViewRef.current) {
      const { clientWidth, clientHeight } = starViewRef.current;
      setStarViewAspectRatio(clientWidth / clientHeight);
    }
  }, []);

  const starViewClassNames = clsx(css.stars, {
    [css.compassInteraction]: inputState.compassInteractionActive,
    [css.angleMarkerInteraction]: inputState.angleMarkerInteractionActive,
  });

  return (
    <div className={css.simulationView}>
      <div className={css.wrapper}>
        <div className={css.sky} />
        <div ref={starViewRef} className={starViewClassNames}>
          <StarView
            epochTime={epochTime}
            lat={observerLat}
            long={observerLon}
            showWesternConstellations={inputState.showWesternConstellations}
            showYupikConstellations={inputState.showYupikConstellations}
            realHeadingFromNorth={inputState.realHeadingFromNorth}
            selectedStarHip={inputState.selectedStarHip}
            angleMarker={inputState.angleMarker}
            compassInteractionActive={inputState.compassInteractionActive}
            angleMarkerInteractionActive={inputState.angleMarkerInteractionActive}
            onStarClick={handleStarClick}
            onRealHeadingFromNorthChange={handleRealHeadingFromNorthChange}
            onAngleMarkerStartPointChange={handleMarkerStartPointChange}
            onAngleMarkerEndPointChange={handleMarkerEndPointChange}
          />
        </div>
        <div className={css.daylight} style={{ opacity: daytimeOpacity(inputState) }} />
        <div className={css.landscapeContainer}>
          <Landscape
            aspectRatio={starViewAspectRatio}
            realHeadingFromNorth={inputState.realHeadingFromNorth}
            headingFromAssumedNorthStar={headingFromAssumedNorthStar}
          />
        </div>
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

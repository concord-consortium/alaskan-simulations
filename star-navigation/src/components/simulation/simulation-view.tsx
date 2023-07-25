import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { clsx } from "clsx";
import { IModelInputState } from "../../types";
import { StarView } from "../star-view/star-view";
import { daytimeOpacity } from "../../utils/daytime";
import { getHeadingFromAssumedNorthStar, invertCelestialSphereRotation } from "../../utils/sim-utils";
import { Landscape } from "./landscape";
import { Button } from "../button";

import BackIcon from "../../assets/back-icon.svg";

import css from "./simulation-view.scss";


// This function compares two points taking into account floating point errors. We operate on ranges of values close
// to 1000, so when two points are closer than 1e-3, we can surely consider them equal.
const pointsEqual = (p1: THREE.Vector3, p2: THREE.Vector3) => p1.distanceTo(p2) < 1e-3;

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

  const handleAssumedNorthStarClick = (starHip: number) => {
    setInputState({ assumedNorthStarHip: starHip });
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
    if (!inputState.angleMarker) {
      return;
    }
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: endPoint, epochTime, lat: observerLat, long: observerLon
    });
    setInputState({
      angleMarker: {
        startPoint: inputState.angleMarker.startPoint,
        endPoint: pointWithoutRotation.toArray(),
        createdAtEpoch: epochTime
      }
    });
  };

  const handleMarkerFinalize = (endPoint: THREE.Vector3) => {
    if (!inputState.angleMarker) {
      handleMarkerCancel();
      return;
    }
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: endPoint, epochTime, lat: observerLat, long: observerLon
    });
    const startPoint = new THREE.Vector3(...inputState.angleMarker.startPoint);
    if (pointsEqual(pointWithoutRotation, startPoint)) {
      // User started and finished drawing at the same star. Cancel the marker.
      handleMarkerCancel();
      return;
    }
    handleMarkerEndPointChange(endPoint);
  };

  const handleMarkerCancel = () => {
    setInputState({
      angleMarker: null
    });
  };

  let headingFromAssumedNorthStar;
  if (inputState.assumedNorthStarHip) {
    headingFromAssumedNorthStar = getHeadingFromAssumedNorthStar({
      assumedNorthStarHip: inputState.assumedNorthStarHip,
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
            assumedNorthStarHip={inputState.assumedNorthStarHip}
            angleMarker={inputState.angleMarker}
            compassInteractionActive={inputState.compassInteractionActive}
            angleMarkerInteractionActive={inputState.angleMarkerInteractionActive}
            onAssumedNorthStarClick={handleAssumedNorthStarClick}
            onRealHeadingFromNorthChange={handleRealHeadingFromNorthChange}
            onAngleMarkerStartPointChange={handleMarkerStartPointChange}
            onAngleMarkerEndPointChange={handleMarkerEndPointChange}
            onAngleMarkerFinalize={handleMarkerFinalize}
            onAngleMarkerCancel={handleMarkerCancel}
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
            <Button className={css.button} onClick={handleRotateLeft}><BackIcon /></Button>
          </div>
          <div className={css.buttonContainer}>
            <div>+5°</div>
            <Button className={css.button} onClick={handleRotateRight}><BackIcon style={{transform: "rotate(180deg)"}} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { clsx } from "clsx";
import { getTimes } from "suncalc";
import { ScrollingSelect } from "common";
import { config } from "../../config";
import { IModelInputState, SNAPSHOT_REQUESTED } from "../../types";
import { StarView } from "../star-view/star-view";
import { getDateTimeString, getHeadingFromAssumedNorthStar, getStarHeadingFromNorth, invertCelestialSphereRotation } from "../../utils/sim-utils";
import { dateToFractionalHoursInRightTimezone } from "../../utils/daylight-utils";
import { Landscape } from "./landscape";

import css from "./simulation-view.scss";

export const withinHour = (timeOfDay: number, fractionalHour: number) => {
  return (timeOfDay >= Math.floor(fractionalHour)) && (timeOfDay < Math.ceil(fractionalHour));
};

export const daytimeOpacity = (inputState: Pick<IModelInputState, "month" | "timeOfDay" | "day">) => {
  const date = new Date(getDateTimeString(inputState));
  const times = getTimes(date, config.observerLat, config.observerLong);
  const sunrise = dateToFractionalHoursInRightTimezone(times.sunrise);
  const sunset = dateToFractionalHoursInRightTimezone(times.sunset);
  const timeOfDay = inputState.timeOfDay;

  let result: number;
  if (withinHour(timeOfDay, sunrise) || withinHour(timeOfDay, sunset)) {
    result = 0.5;
  } else if ((timeOfDay < sunrise) || (timeOfDay > sunset)) {
    result = 0;
  } else {
    result = 1;
  }

  return result;
};

// This function compares two points taking into account floating point errors. We operate on ranges of values close
// to 1000, so when two points are closer than 1e-3, we can surely consider them equal.
const pointsEqual = (p1: THREE.Vector3, p2: THREE.Vector3) => p1.distanceTo(p2) < 1e-3;

interface IProps {
  epochTime: number;
  inputState: IModelInputState;
  setInputState: (inputState: Partial<IModelInputState>) => void;
}

const getMissingSnapshotImage = (inputState: IModelInputState) => {
  if (!!inputState.pointADepartureSnapshot && inputState.pointADepartureSnapshot.starViewImageSnapshot === SNAPSHOT_REQUESTED) {
    return "pointADepartureSnapshot";
  }
  if (!!inputState.pointBArrivalSnapshot && inputState.pointBArrivalSnapshot.starViewImageSnapshot === SNAPSHOT_REQUESTED) {
    return "pointBArrivalSnapshot";
  }
  if (!!inputState.pointBDepartureSnapshot && inputState.pointBDepartureSnapshot.starViewImageSnapshot === SNAPSHOT_REQUESTED) {
    return "pointBDepartureSnapshot";
  }
  if (!!inputState.pointCArrivalSnapshot && inputState.pointCArrivalSnapshot.starViewImageSnapshot === SNAPSHOT_REQUESTED) {
    return "pointCArrivalSnapshot";
  }
  return null;
};

export const SimulationView: React.FC<IProps> = ({ inputState, setInputState, epochTime }) => {
  const starViewRef = useRef<HTMLDivElement>(null);
  const [starViewAspectRatio, setStarViewAspectRatio] = useState<number>(0);
  const { observerLat, observerLong } = config;

  const handleAssumedNorthStarClick = (starHip: number) => {
    setInputState({
      assumedNorthStarHip: starHip,
      // Reset user heading so they face the selected star perfectly.
      realHeadingFromNorth: getStarHeadingFromNorth({
        starHip,
        epochTime,
        lat: observerLat,
        long: observerLong
      })
    });
  };

  const handleRealHeadingFromNorthChange = useCallback((realHeadingFromNorth: number) => {
    setInputState({ realHeadingFromNorth });
  }, [setInputState]);

  const handleRotateLeft = useCallback(() => {
    setInputState({ realHeadingFromNorth: (inputState.realHeadingFromNorth - 5 + 360) % 360 });
  }, [setInputState, inputState.realHeadingFromNorth]);

  const handleRotateRight = useCallback(() => {
    setInputState({ realHeadingFromNorth: (inputState.realHeadingFromNorth + 5) % 360 });
  }, [setInputState, inputState.realHeadingFromNorth]);

  const handleMarkerStartPointChange = useCallback((startPoint: THREE.Vector3) => {
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: startPoint, epochTime, lat: observerLat, long: observerLong
    });
    setInputState({
      angleMarker: {
        startPoint: pointWithoutRotation.toArray(),
        endPoint: null,
        createdAtEpoch: epochTime
      }
    });
  }, [setInputState, epochTime, observerLat, observerLong]);

  const handleMarkerEndPointChange = useCallback((endPoint: THREE.Vector3) => {
    if (!inputState.angleMarker) {
      return;
    }
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: endPoint, epochTime, lat: observerLat, long: observerLong
    });
    setInputState({
      angleMarker: {
        startPoint: inputState.angleMarker.startPoint,
        endPoint: pointWithoutRotation.toArray(),
        createdAtEpoch: epochTime
      }
    });
  }, [epochTime, inputState.angleMarker, observerLat, observerLong, setInputState]);

  const handleMarkerCancel = useCallback(() => {
    setInputState({
      angleMarker: null
    });
  }, [setInputState]);

  const handleMarkerFinalize = useCallback((endPoint: THREE.Vector3) => {
    if (!inputState.angleMarker) {
      handleMarkerCancel();
      return;
    }
    const pointWithoutRotation = invertCelestialSphereRotation({
      point: endPoint, epochTime, lat: observerLat, long: observerLong
    });
    const startPoint = new THREE.Vector3(...inputState.angleMarker.startPoint);
    if (pointsEqual(pointWithoutRotation, startPoint)) {
      // User started and finished drawing at the same star. Cancel the marker.
      handleMarkerCancel();
      return;
    }
    handleMarkerEndPointChange(endPoint);
  }, [epochTime, inputState.angleMarker, observerLat, observerLong, handleMarkerEndPointChange, handleMarkerCancel]);

  let headingFromAssumedNorthStar;
  if (inputState.assumedNorthStarHip) {
    headingFromAssumedNorthStar = getHeadingFromAssumedNorthStar({
      assumedNorthStarHip: inputState.assumedNorthStarHip,
      realHeadingFromNorth: inputState.realHeadingFromNorth,
      epochTime,
      lat: observerLat,
      long: observerLong
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

  // It's a bit weird way of requesting snapshots through state and props, but it actually seems much cleaner
  // than using a very long chain of refs.
  const snapshotRequested = !!getMissingSnapshotImage(inputState);
  const handleSnapshotReady = useCallback((snapshot: string) => {
    const missingSnapshot = getMissingSnapshotImage(inputState);
    if (!missingSnapshot) {
      return;
    }
    setInputState({
      [missingSnapshot]: {
        ...inputState[missingSnapshot],
        starViewImageSnapshot: snapshot
      }
    });
  }, [inputState, setInputState]);

  // % 360 is necessary because of the Math.round (eg. 359.5 will become 360)
  const displayHeading = headingFromAssumedNorthStar !== undefined ? Math.round(headingFromAssumedNorthStar) % 360 : undefined;

  return (
    <div className={css.simulationView}>
      <div className={css.wrapper}>
        <div className={css.sky} />
        <div ref={starViewRef} className={starViewClassNames}>
          <StarView
            epochTime={epochTime}
            lat={observerLat}
            long={observerLong}
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
            snapshotRequested={snapshotRequested}
            onSnapshotReady={handleSnapshotReady}
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
        <div className={css.headingMarker} />
        <div className={css.buttons}>
          <ScrollingSelect
            value={`Heading ${displayHeading !== undefined ? `${displayHeading}°` : ""}`}
            onBackClick={handleRotateLeft}
            onForwardClick={handleRotateRight}
            valueMinWidth={110}
          />
        </div>
      </div>
    </div>
  );
};

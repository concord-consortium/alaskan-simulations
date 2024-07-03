import React, { useCallback } from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import { IModelInputState, ISnapshot, SNAPSHOT_REQUESTED } from "../../types";
import { RouteMap } from "./route-map";
import { Button } from "../button";
import { Snapshot } from "./snapshot";

import css from "./right-container.scss";

const timeDiffInHours = (time1: number, time2: number) => {
  const diff = Math.abs(time1 - time2);
  return Math.min(diff, 24 - diff);
};

interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  setInputState: (update: Partial<IModelInputState>) => void;
}

export const RightContainer: React.FC<IProps> = ({ inputState, disableInputs, setInputState }) => {
  const { t } = useTranslation();

  const { journeyLeg } = inputState;
  const AtoB = journeyLeg === "AtoB";
  const departurePoint = AtoB ? "A" : "B";
  const arrivalPoint = AtoB ? "B" : "C";
  const departureSnapshot = inputState[`point${departurePoint}DepartureSnapshot`]; // this is type safe
  const arrivalSnapshot = inputState[`point${arrivalPoint}ArrivalSnapshot`]; // this is type safe
  const snapshotDisabled = !inputState.assumedNorthStarHip;
  const takeYourTripDisabled = !inputState.pointADepartureSnapshot || !inputState.pointBArrivalSnapshot || !inputState.pointBDepartureSnapshot || !inputState.pointCArrivalSnapshot;

  const handleJourneyChangeAtoB = () => setInputState({ journeyLeg: "AtoB" });

  const handleJourneyChangeBtoC = () => setInputState({ journeyLeg: "BtoC" });

  const handleTakeYourRouteClick = () => setInputState({ showUserTrip: true });

  const handleResetRouteClick = () => setInputState({
    pointADepartureSnapshot: null,
    pointBArrivalSnapshot: null,
    pointBDepartureSnapshot: null,
    pointCArrivalSnapshot: null,
    showUserTrip: false,
    journeyLeg: "AtoB",
    timeOfDay: 0
  });

  const handlePointBChange = useCallback((pointB: { x: number; y: number }) => setInputState({ pointB }), [setInputState]);

  const getSnapshotData = (): ISnapshot | null => {
    if (!inputState.assumedNorthStarHip) {
      return null;
    }
    return {
      month: inputState.month,
      day: inputState.day,
      timeOfDay: inputState.timeOfDay,
      assumedNorthStarHip: inputState.assumedNorthStarHip,
      realHeadingFromNorth: inputState.realHeadingFromNorth,
      // This is a special value that will trigger snapshot generation in the star-view component.
      // When the snapshot is ready, a state here will be updated.
      starViewImageSnapshot: SNAPSHOT_REQUESTED
    };
  };

  const handleTakeDepartureSnapshot = () =>
    setInputState(AtoB ? { pointADepartureSnapshot: getSnapshotData() } : { pointBDepartureSnapshot: getSnapshotData() });

  const handleTakeArrivalSnapshot = () =>
    setInputState(AtoB ? { pointBArrivalSnapshot: getSnapshotData() } : { pointCArrivalSnapshot: getSnapshotData() });

  const handleDeleteDepartureSnapshot = () =>
    setInputState(AtoB ? { pointADepartureSnapshot: null } : { pointBDepartureSnapshot: null });

  const handleDeleteArrivalSnapshot = () =>
    setInputState(AtoB ? { pointBArrivalSnapshot: null } : { pointCArrivalSnapshot: null });

  let AtoBHeading, AtoBDuration, BtoCHeading, BtoCDuration;
  if (inputState.pointADepartureSnapshot && inputState.pointBArrivalSnapshot && inputState.pointBDepartureSnapshot && inputState.pointCArrivalSnapshot) {
    AtoBHeading = inputState.pointADepartureSnapshot.realHeadingFromNorth;
    AtoBDuration = timeDiffInHours(inputState.pointBArrivalSnapshot.timeOfDay, inputState.pointADepartureSnapshot.timeOfDay);
    BtoCHeading = inputState.pointBDepartureSnapshot.realHeadingFromNorth;
    BtoCDuration = timeDiffInHours(inputState.pointCArrivalSnapshot.timeOfDay, inputState.pointBDepartureSnapshot.timeOfDay);
  }

  return (
    <div className={css.rightContainer}>
      <div className={css.label}>{t("PLAN_YOUR_ROUTE")}</div>
      <RouteMap
        pointB={inputState.pointB}
        onPointBChange={handlePointBChange}
        showUserTrip={inputState.showUserTrip}
        AtoBHeading={AtoBHeading}
        AtoBDuration={AtoBDuration}
        BtoCHeading={BtoCHeading}
        BtoCDuration={BtoCDuration}
      />
      <div className={css.label}>{t("CHART_HEADINGS_TIMES")}</div>
      <div className={clsx(css.label, css.light)}>{t(`DEPARTURE_FROM_POINT_${departurePoint}`)}</div>
      <div className={css.container}>
        <Snapshot
          buttonLabel={t(`RECORD_STAR_CHART_FOR_POINT_${departurePoint}_DEPARTURE`)}
          snapshot={departureSnapshot}
          onTakeSnapshot={handleTakeDepartureSnapshot}
          onSnapshotDelete={handleDeleteDepartureSnapshot}
          disabled={snapshotDisabled}
        />
      </div>
      <div className={clsx(css.label, css.light)}>{t(`ARRIVAL_AT_POINT_${arrivalPoint}`)}</div>
      <div className={css.container}>
        <Snapshot
          buttonLabel={t(`RECORD_STAR_CHART_FOR_POINT_${arrivalPoint}_ARRIVAL`)}
          snapshot={arrivalSnapshot}
          onTakeSnapshot={handleTakeArrivalSnapshot}
          onSnapshotDelete={handleDeleteArrivalSnapshot}
          disabled={snapshotDisabled}
        />
        <div className={css.buttonsRow}>
          <Button selected={AtoB} onClick={handleJourneyChangeAtoB}>{ t("A_TO_B") }</Button>
          <Button selected={!AtoB} onClick={handleJourneyChangeBtoC}>{ t("B_TO_C") }</Button>
          <Button
            className={css.takeYourTripBtn}
            onClick={!inputState.showUserTrip ? handleTakeYourRouteClick : handleResetRouteClick}
            disabled={takeYourTripDisabled}
          >
            { !inputState.showUserTrip ? t("TAKE_YOUR_TRIP") : t("RESET_ROUTE") }
          </Button>
        </div>
      </div>
    </div>
  );
};

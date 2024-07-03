import React from "react";
import { useTranslation } from "common";
import { config } from "../../config";
import { Button } from "../button";
import { ISnapshot, Month, SNAPSHOT_REQUESTED } from "../../types";
import { getDateTimeString, getHeadingFromAssumedNorthStar, timeToAMPM } from "../../utils/sim-utils";
import CloseButtonSvg from "../../assets/close-button.svg";

import css from "./snapshot.scss";

interface IProps {
  buttonLabel: string|JSX.Element;
  snapshot: ISnapshot | null;
  onTakeSnapshot: () => void;
  onSnapshotDelete: () => void;
  disabled: boolean;
}

const SnapshotData: React.FC<{ snapshot: ISnapshot, onSnapshotDelete: () => void }> = ({ snapshot, onSnapshotDelete }) => {
  const { t } = useTranslation();
  const { month, day, timeOfDay, starViewImageSnapshot, assumedNorthStarHip, realHeadingFromNorth } = snapshot;

  const date = new Date(getDateTimeString(snapshot));
  const epochTime = date.getTime();
  const headingFromAssumedNorthStar = getHeadingFromAssumedNorthStar({
    assumedNorthStarHip,
    realHeadingFromNorth,
    epochTime,
    lat: config.observerLat,
    long: config.observerLong
  });

  return (
    <div className={css.snapshotData} style={starViewImageSnapshot !== SNAPSHOT_REQUESTED ? { backgroundImage: `url(${starViewImageSnapshot})` } : undefined}>
      <div className={css.textUppercase}>
        { t(Month[month] + "_SHORT") } { day } { timeToAMPM(timeOfDay) }
      </div>
      <div className={css.text}>
        {/* % 360 is necessary because of the Math.round (eg. 359.5 will become 360) */}
        Heading: { Math.round(headingFromAssumedNorthStar) % 360 }°
      </div>
      <button onClick={onSnapshotDelete}><CloseButtonSvg /></button>
    </div>
  );
};

export const Snapshot: React.FC<IProps> = ({ buttonLabel, disabled, snapshot, onTakeSnapshot, onSnapshotDelete }) => {
  return (
    <div className={css.snapshot}>
      {
        !snapshot &&
        <Button className={css.snapshotButton} onClick={onTakeSnapshot} disabled={disabled}>{buttonLabel}</Button>
      }
      {
        snapshot &&
        <SnapshotData snapshot={snapshot} onSnapshotDelete={onSnapshotDelete} />
      }
    </div>
  );
};

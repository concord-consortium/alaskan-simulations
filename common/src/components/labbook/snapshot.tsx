import React from "react";
import clsx from "clsx";
import { Button, t } from "common";
import DeleteSnapshotSVG from "../../assets/close-button-violet.svg";
import SnapShotIconSVG from "../../assets/snapshot-icon.svg";

import css from "./snapshot.scss";

export type Sim = "kitchen-lab" | "plant-growth-lab" | "storm-lab"

const getClassName = (sim?: Sim) => {
  return clsx(css.snapShotContainer, {
    [css.kitchenLab]: sim === "kitchen-lab",
    [css.plantGrowthLab]: sim === "plant-growth-lab",
    [css.stormLab]: sim === "storm-lab",
  });
};

interface IPlaceholderProps {
  sim?: Sim;
}

export const Placeholder: React.FC<IPlaceholderProps> = ({sim}) => (
  <div className={getClassName(sim)}>
    <div className={css.buttonContainer}/>
  </div>
);

interface ITakeSnapshotButtonProps {
  idx: number;
  sim?: Sim;
  disabled?: boolean;
  onSetSnapshot?: (idx: number) => void;
}

export const TakeSnapshotButton: React.FC<ITakeSnapshotButtonProps> = ({ disabled, onSetSnapshot, idx, sim }) => {
  const handleClick = () => {
    onSetSnapshot?.(idx);
  };

  return (
    <div className={getClassName(sim)}>
      <div className={css.buttonContainer}>
        <Button
          icon={<SnapShotIconSVG />}
          innerButtonClassName={css.innerSnapshotButton}
          largerStyle={true}
          disabled={disabled}
          onClick={handleClick}
        />
      </div>

      <div className={clsx(css.snapShotDescription, css.takeSnapshot, { [css.disabled]: disabled })}>
        {t("INSTRUCTIONS.TAKE_SNAPSHOT")}
      </div>
    </div>
  );
};

interface ISnapshotWithDescriptionProps {
  idx: number;
  sim?: Sim;
  SnapshotImg: React.FC;
  BackgroundImg?: React.FC;
  description?: string;
  flipSnapshot?: boolean;
  hideDescription?: boolean;
  onDeleteSnapshot?: (idx: number) => void;
}

export const SnapshotWithDescription: React.FC<ISnapshotWithDescriptionProps> = ({ SnapshotImg, BackgroundImg, description, hideDescription, flipSnapshot, onDeleteSnapshot, idx, sim }) => {
  const handleDeleteSnapshot = () => {
    onDeleteSnapshot?.(idx);
  };

  return (
    <div className={getClassName(sim)}>
      <div className={css.snapshotWithDescription}>
        <button onClick={handleDeleteSnapshot} className={css.closeButton}>
          <DeleteSnapshotSVG />
        </button>
        {BackgroundImg && <div className={css.background}><BackgroundImg /></div>}
        <div className={clsx(css.foreground, {[css.flip]: flipSnapshot})}><SnapshotImg /></div>
      </div>
      {!hideDescription &&
        <div className={css.snapShotDescription}>
          { description }
        </div>
      }
    </div>
  );
};

interface IProps {
  idx: number;
  sim?: Sim;
  disabled?: boolean;
  SnapshotImg?: React.FC;
  BackgroundImg?: React.FC;
  snapshotDescription?: string;
  hideDescription?: boolean;
  flipSnapshot?: boolean;
  onSetSnapshot?: (idx: number) => void;
  onDeleteSnapshot?: (idx: number) => void;
}

export const Snapshot: React.FC<IProps> = (props) => {
  const { SnapshotImg, snapshotDescription, onSetSnapshot } = props;
  if (SnapshotImg !== undefined) {
    return <SnapshotWithDescription {...props} SnapshotImg={SnapshotImg} description={snapshotDescription} />;
  } else {
    // Placeholder will be used in the "Compare data" view.
    return onSetSnapshot ? <TakeSnapshotButton {...props} /> : <Placeholder {...props} />;
  }
};

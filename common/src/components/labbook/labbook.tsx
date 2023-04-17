import React from "react";
import { Button, LabeledContainer, t } from "common";
import LabbookSvg from "../../assets/lab-notebook.svg";
import TrashCanIcon from "../../assets/delete-experiment-icon.svg";
import { ExperimentButtons } from "../second-grade-frame/experiment-buttons";

import css from "./labbook.scss";

interface IProps {
  activeRunIdx: number;
  disabled: boolean;
  onDeleteExperiment: () => void;
  compareRunIdx?: number;
  setCompareRunIdx: (runIdx: number) => void;
  LeftLabbookPage: JSX.Element;
  RightLabbookPage: JSX.Element;
  Background?: JSX.Element;
}

export const Labbook: React.FC<IProps> = ({ activeRunIdx, disabled, onDeleteExperiment,
  compareRunIdx, setCompareRunIdx, LeftLabbookPage, RightLabbookPage, Background }) => {

  return (
    <div className={css.labbookContainer}>
      <div className={css.label}>{t("TABLE_HEADER.LABBOOK")}</div>
      <div className={css.labbook}>
        {Background || <LabbookSvg className={css.labbookBackground} />}
        <div className={css.leftPage}>
          <LabeledContainer
            label={t("LABEL.RECORD_DATA")}
            style="violet"
            className={css.labelOnly}
            largerStyle={true}
          />
          <div className={css.experimentHeader}>
            <div className={css.title}>{t("EXPERIMENT")}</div>
            <div className={css.titleNumber}>{activeRunIdx + 1}</div>
            <div className={css.deleteExperiment}>
              <Button
                icon={<TrashCanIcon />}
                className={css.deleteButton}
                label={t("BUTTON.DELETE")}
                largerStyle={true}
                disabled={disabled}
                onClick={onDeleteExperiment}
              />
            </div>
          </div>
          {LeftLabbookPage}
        </div>
        <div className={css.rightPage}>
          <LabeledContainer
            label={t("LABEL.COMPARE_DATA")}
            style="violet"
            className={css.labelOnly}
            largerStyle={true}
          />
          <div className={css.compareDataSelector}>
            <ExperimentButtons activeRunIdx={compareRunIdx} onChangeRunIdx={setCompareRunIdx} narrow={true} />
          </div>
          {compareRunIdx !== undefined && RightLabbookPage}
        </div>
      </div>
    </div>
  );
};

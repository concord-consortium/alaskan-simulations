import React from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import { IModelInputState } from "../../types";
import { RouteMap } from "./route-map";
import { Button } from "../button";
import { Snapshot } from "./snapshot";

import css from "./right-container.scss";

interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  setInputState: (update: Partial<IModelInputState>) => void;
}

export const RightContainer: React.FC<IProps> = ({ inputState, disableInputs, setInputState }) => {
  const { t, tStringOnly } = useTranslation();

  return (
    <div className={css.rightContainer}>
      <div className={css.label}>{t("PLAN_YOUR_ROUTE")}</div>
      <RouteMap />
      <div className={css.label}>{t("CHART_HEADINGS_TIMES")}</div>
      <div className={clsx(css.label, css.light)}>{t("DEPARTURE_FROM_POINT_A")}</div>
      <div className={css.container}>
        <Snapshot
          buttonLabel={tStringOnly("RECORD_STAR_CHART_FOR_POINT_A_DEPARTURE")}
        />
      </div>
      <div className={clsx(css.label, css.light)}>{t("ARRIVAL_AT_POINT_B")}</div>
      <div className={css.container}>
        <Snapshot
          buttonLabel={tStringOnly("RECORD_STAR_CHART_FOR_POINT_B_ARRIVAL")}
        />
        <div className={css.buttonsRow}>
          <Button>{tStringOnly("A_TO_B")}</Button>
          <Button>{tStringOnly("B_TO_C")}</Button>
          <Button className={css.takeYourTripBtn}>{tStringOnly("TAKE_YOUR_TRIP")}</Button>
        </div>
      </div>
    </div>
  );
};

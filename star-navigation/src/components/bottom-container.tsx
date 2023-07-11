import React from "react";
import {
  Slider, Option, ScrollingSelect, useTranslation
} from "common";
import { IModelInputState, Month } from "../types";
import { timeToAMPM } from "../utils/sim-utils";

import css from "./bottom-container.scss";

interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  onTimeOfDayChange: (value: number) => void;
  onMonthChange: (value: number) => void;
}

export const BottomContainer: React.FC<IProps> = ({ inputState, disableInputs, onMonthChange, onTimeOfDayChange }) => {
  const { t } = useTranslation();

  const handleTimeOfDayChange = (event: Event, value: number) => {
    onTimeOfDayChange(value);
  };

  const handleMonthChange = (value: string | null) => {
    onMonthChange(Number(value) || 1);
  };

  return (
    <div className={css.bottomContainer}>
      <div className={css.row}>
        <div className={css.timeSliderContainer}>
          <Slider
            value={inputState.timeOfDay}
            min={0}
            max={24}
            step={1 / 60}
            label={""}
            onChange={handleTimeOfDayChange}
          />
        </div>
      </div>
      <div className={css.row}>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("CONSTELLATIONS")}</div>
          <div className={css.content}>
            <div className={css.content100}>
            </div>
          </div>
        </div>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("MONTH")}</div>
          <div className={css.content}>
            <div className={css.content100}>
              <ScrollingSelect value={inputState.month !== null ? inputState.month.toString() : null} onChange={handleMonthChange} disabled={disableInputs}>
                <Option value="1">{t(Month.January)}</Option>
                <Option value="2">{t(Month.February)}</Option>
                <Option value="3">{t(Month.March)}</Option>
                <Option value="4">{t(Month.April)}</Option>
                <Option value="5">{t(Month.May)}</Option>
                <Option value="6">{t(Month.June)}</Option>
                <Option value="7">{t(Month.July)}</Option>
                <Option value="8">{t(Month.August)}</Option>
                <Option value="9">{t(Month.September)}</Option>
                <Option value="10">{t(Month.October)}</Option>
                <Option value="11">{t(Month.November)}</Option>
                <Option value="12">{t(Month.December)}</Option>
              </ScrollingSelect>
            </div>
          </div>
        </div>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("DAY")}</div>
          <div className={css.content}>
            <div className={css.content100}>
            </div>
          </div>
        </div>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("TIME")}</div>
          <div className={css.content}>
            <div className={css.content100}>
              {timeToAMPM(inputState.timeOfDay)}
            </div>
          </div>
        </div>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("NAVIGATION_MARKERS")}</div>
          <div className={css.content}>
            <div className={css.content50}></div>
            <div className={css.content50}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

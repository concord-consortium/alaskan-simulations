import React from "react";
import { clsx } from "clsx";
import { Checkbox, Option, ScrollingSelect, useTranslation, LargeToggle } from "common";
import { IModelInputState, Month } from "../../types";
import { daysInMonth, timeToAMPM } from "../../utils/sim-utils";
import { config } from "../../config";
import { TimeCircularInput } from "./time-circular-input";
import CompassIcon from "../../assets/compass_icon.png";
import CompassSelectedIcon from "../../assets/compass_icon_selected.png";
import AngleIcon from "../../assets/angle_icon.png";
import AngleSelectedIcon from "../../assets/angle_icon_selected.png";

import css from "./bottom-container.scss";


interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  setInputState: (update: Partial<IModelInputState>) => void;
}

const getDaysInMonthArray = (month: number) => Array.from({ length: daysInMonth(month) }, (_, idx) => idx + 1);

export const BottomContainer: React.FC<IProps> = ({ inputState, disableInputs, setInputState }) => {
  const { t } = useTranslation();

  const handleTimeOfDayChange = (value: number) => {
    const dayChangeDiff = 2.5;
    const oldTimeOfDay = inputState.timeOfDay;
    const newTimeOfDay = value;
    let newDay = inputState.day;
    let newMonth = inputState.month;
    if (newTimeOfDay < dayChangeDiff && oldTimeOfDay > 24 - dayChangeDiff) {
      newDay = inputState.day + 1;
    } else if (newTimeOfDay > 24 - dayChangeDiff && oldTimeOfDay < dayChangeDiff) {
      newDay = inputState.day - 1;
    }
    if (newDay < 1) {
      newMonth = inputState.month - 1;
      newDay = daysInMonth(newMonth);
    } else if (newDay > daysInMonth(inputState.month)) {
      newMonth = inputState.month + 1;
      newDay = 1;
    }
    if (newMonth < 1) {
      newMonth = 12;
    } else if (newMonth > 12) {
      newMonth = 1;
    }
    setInputState({ timeOfDay: newTimeOfDay, day: newDay, month: newMonth });
  };

  const handleMonthChange = (value: string | null) => {
    const month = Number(value);
    setInputState({
      month,
      day: Math.min(inputState.day, daysInMonth(month))
    });
  };

  const handleDayChange = (value: string | null) =>
    setInputState({ day: Number(value) });

  const handleYupikConstellationsChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputState({ showYupikConstellations: event.target.checked });

  const handleWesternConstellationsChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputState({ showWesternConstellations: event.target.checked });

  const handleCompassModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const compassInteractionActive = event.target.checked;
    setInputState({ compassInteractionActive });
    if (compassInteractionActive) {
      setInputState({ angleMarkerInteractionActive: false });
    }
  };

  const handleAngleMarkerModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const angleMarkerInteractionActive = event.target.checked;
    setInputState({ angleMarkerInteractionActive });
    if (angleMarkerInteractionActive) {
      setInputState({ compassInteractionActive: false });
    }
  };

  const monthKeySuffix = config.routeMap ? "_SHORT" : "";
  const scrollingSelectWidth = config.routeMap ? 42 : 92;

  return (
    <div className={css.bottomContainer}>
      <div className={css.timeCircularInput}>
        { t("MIDNIGHT") }
        <TimeCircularInput
          value={inputState.timeOfDay}
          onChange={handleTimeOfDayChange}
        />
        { t("NOON") }
      </div>
      <div className={css.mainRow}>
        <div className={clsx(css.widgetContainer, css.dateAndTime)}>
          <div className={css.label}>{t("DATE_AND_TIME")}</div>
          <div className={css.content}>
            <div className={css.content100}>
            <div className={""}>
              <div className={css.timeOfDay}>
                {timeToAMPM(inputState.timeOfDay)}
              </div>
            </div>
            <div className={""}>
              <ScrollingSelect
                className={css.scrollingSelect}
                value={inputState.month.toString()}
                onChange={handleMonthChange}
                disabled={disableInputs}
                valueMinWidth={scrollingSelectWidth}
              >
                {
                  Object.keys(Month).map((monthNumber: string) => (
                    <Option key={monthNumber} value={monthNumber}>{t(Month[Number(monthNumber)] + monthKeySuffix)}</Option>
                  ))
                }
              </ScrollingSelect>
              <ScrollingSelect
                className={css.scrollingSelect}
                value={inputState.day.toString()}
                onChange={handleDayChange}
                disabled={disableInputs}
                valueMinWidth={scrollingSelectWidth}
              >
                {
                  getDaysInMonthArray(inputState.month).map((day) => (
                    <Option key={day} value={day.toString()}>{day}</Option>
                  ))
                }
              </ScrollingSelect>
            </div>
            </div>
          </div>
        </div>
        <div className={clsx(css.widgetContainer, css.navigationMarks)}>
          <div className={css.label}>{t("NAVIGATION_MARKS")}</div>
          <div className={css.content}>
            <div className={css.content100}>
              <LargeToggle
                image={CompassIcon} checkedImage={CompassSelectedIcon}
                checked={inputState.compassInteractionActive}
                onChange={handleCompassModeChange}
              />
              <LargeToggle
                image={AngleIcon} checkedImage={AngleSelectedIcon}
                checked={inputState.angleMarkerInteractionActive}
                onChange={handleAngleMarkerModeChange}
              />
            </div>
          </div>
        </div>
        <div className={clsx(css.widgetContainer, css.constellations)}>
          <div className={css.label}>{t("CONSTELLATIONS")}</div>
          <div className={css.content}>
            <div className={css.content100}>
              <div className={css.checkboxGroup}>
                <div>
                  <label>{ t("YUPIK") }</label>
                  <Checkbox
                    checked={inputState.showYupikConstellations}
                    onChange={handleYupikConstellationsChange}
                  />
                </div>
                <div>
                  <label>{ t("WESTERN") }</label>
                  <Checkbox
                    checked={inputState.showWesternConstellations}
                    onChange={handleWesternConstellationsChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

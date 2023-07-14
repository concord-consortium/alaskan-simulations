import React from "react";
import clsx from "clsx";
import { Checkbox, Option, ScrollingSelect, useTranslation, LargeToggle } from "common";
import { TimeSlider } from "./time-slider";
import { IModelInputState, Month } from "../types";
import { daysInMonth, timeToAMPM } from "../utils/sim-utils";
import CompassIcon from "../assets/compass_icon.png";
import CompassSelectedIcon from "../assets/compass_icon_selected.png";
import AngleIcon from "../assets/angle_icon.png";
import AngleSelectedIcon from "../assets/angle_icon_selected.png";

import css from "./bottom-container.scss";

interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  setInputState: (update: Partial<IModelInputState>) => void;
}

const getDaysInMonthArray = (month: number) => Array.from({ length: daysInMonth(month) }, (_, idx) => idx + 1);

export const BottomContainer: React.FC<IProps> = ({ inputState, disableInputs, setInputState }) => {
  const { t } = useTranslation();

  const handleTimeOfDayChange = (event: Event, value: number) => {
    setInputState({ timeOfDay: value });
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

  return (
    <div className={css.bottomContainer}>
      <div className={css.row}>
        <div className={css.timeSliderContainer}>
          <div className={css.label}>{t("MIDNIGHT")}</div>
          <TimeSlider
            value={inputState.timeOfDay}
            day={inputState.day}
            month={inputState.month}
            onChange={handleTimeOfDayChange}
          />
          <div className={css.label}>{t("MIDNIGHT")}</div>
        </div>
      </div>
      <div className={css.row}>
        <div className={css.widgetContainer}>
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
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("MONTH")}</div>
          <div className={css.content}>
            <div className={css.content100}>
              <ScrollingSelect
                value={inputState.month.toString()}
                onChange={handleMonthChange}
                disabled={disableInputs}
                valueMinWidth={53}
              >
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
              <ScrollingSelect
                value={inputState.day.toString()}
                onChange={handleDayChange}
                disabled={disableInputs}
                valueMinWidth={37}
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
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("TIME")}</div>
          <div className={css.content}>
            <div className={clsx(css.content100, css.timeOfDay)}>
              {timeToAMPM(inputState.timeOfDay)}
            </div>
          </div>
        </div>
        <div className={css.widgetContainer}>
          <div className={css.label}>{t("NAVIGATION_MARKERS")}</div>
          <div className={css.content}>
            <div className={css.content50}>
              <LargeToggle image={CompassIcon} checkedImage={CompassSelectedIcon}  />
            </div>
            <div className={css.content50}>
              <LargeToggle image={AngleIcon} checkedImage={AngleSelectedIcon} disabled={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

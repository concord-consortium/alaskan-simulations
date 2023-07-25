import React from "react";
import clsx from "clsx";
import { Checkbox, Option, ScrollingSelect, useTranslation, LargeToggle } from "common";
import { TimeSlider } from "./time-slider";
import { IModelInputState, Month } from "../../types";
import { daysInMonth, timeToAMPM } from "../../utils/sim-utils";
import { config } from "../../config";

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
                valueMinWidth={config.routeMap ? 53 : 92}
              >
                <Option value="1">{t(Month.January + monthKeySuffix)}</Option>
                <Option value="2">{t(Month.February + monthKeySuffix)}</Option>
                <Option value="3">{t(Month.March + monthKeySuffix)}</Option>
                <Option value="4">{t(Month.April + monthKeySuffix)}</Option>
                <Option value="5">{t(Month.May + monthKeySuffix)}</Option>
                <Option value="6">{t(Month.June + monthKeySuffix)}</Option>
                <Option value="7">{t(Month.July + monthKeySuffix)}</Option>
                <Option value="8">{t(Month.August + monthKeySuffix)}</Option>
                <Option value="9">{t(Month.September + monthKeySuffix)}</Option>
                <Option value="10">{t(Month.October + monthKeySuffix)}</Option>
                <Option value="11">{t(Month.November + monthKeySuffix)}</Option>
                <Option value="12">{t(Month.December + monthKeySuffix)}</Option>
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
              <LargeToggle
                image={CompassIcon} checkedImage={CompassSelectedIcon}
                checked={inputState.compassInteractionActive}
                onChange={handleCompassModeChange}
              />
            </div>
            <div className={css.content50}>
              <LargeToggle
                image={AngleIcon} checkedImage={AngleSelectedIcon}
                checked={inputState.angleMarkerInteractionActive}
                onChange={handleAngleMarkerModeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import {
  SimulationFrame, t, useModelState, Slider, Option, ScrollingSelect, Mark, getDefaultLanguage
} from "common";
import clsx from "clsx";

import { SimulationView } from "./simulation/simulation-view";
import { IModelInputState, IModelOutputState, Constellation, Month } from "../types";
import { formatTimeNumber, fractionalHourToTimeString, getConstellationAtTargetTime, monthLabel, timeToAMPM } from "../utils/sim-utils";
import { skyModelerDirections } from "./sky-modeler-directions";

import css from "./app.scss";

// Observer location is at Hooper Bay, Alaska.
const OBSERVER_LAT = 61.523997904;
const OBSERVER_LON = -166.090999636;

const YEAR = 2022;
// The day is specified for each month separately to ensure that only one constellation is perfectly centered in the horizon view.
// If day was hardcoded to a constant value, it could be difficult for users to pick just one constellation in some months.
const DAY: Record<number, number> = {
  1: 12,
  2: 3,
  3: 18,
  4: 25,
  5: 30,
  6: 18,
  7: 16,
  8: 18,
  9: 15,
  10: 15,
  11: 14,
  12: 2
};

// PDT: March 13 <-> November 6
// PST: November 6 <-> March 13
const getTimezone = (month: number) => month <= 2 || month >= 12 ? "-08:00"  /* PST */ : "-07:00" /* PDT */;

const getDateTimeString = (month: number, hour: number) =>
  `${YEAR}-${formatTimeNumber(month)}-${formatTimeNumber(DAY[month])}T${fractionalHourToTimeString(hour)}${getTimezone(month)}`;

export const App: React.FC = () => {

  const sliderMarks: Mark[] = [];
  for (let hour = 0; hour <= 24; hour++) {
    const label = (hour === 0) || (hour === 24) ? t("TIME.MIDNIGHT") : (hour === 12 ? t("TIME.NOON") : undefined);
    sliderMarks.push({value: hour, label});
  }

  const modelState = useModelState<IModelInputState, IModelOutputState>(useMemo(() => ({
    initialInputState: {
      predictedConstellation: null,
      month: 1,
      timeOfDay: 0,
      answerChecked: false
    },
    initialOutputState: {
      constellationMatch: null
    }
  }), []));

  const { inputState, setInputState, setOutputState } = modelState;


  const constellationMatch = () => {
    const { month, predictedConstellation } = inputState;
    const constellationAtTargetTime = month ? getConstellationAtTargetTime(month) : null;
    return constellationAtTargetTime ? predictedConstellation === constellationAtTargetTime : false;
  };

  const handleTimeOfDayChange = (event: Event, value: number) => {
    setInputState({
      timeOfDay: value
    });
  };


  const handleMonthChange = (value: string | null) => {
    setInputState({
      answerChecked: false,
      month: Number(value) || 1
    });
  };

  const disableInputs = inputState.answerChecked && !!constellationMatch();

  const date = new Date(getDateTimeString(inputState.month || 1, inputState.timeOfDay));
  const epochTime = date.getTime();

  const lang = getDefaultLanguage();

  const noop = () => undefined;

  return (
    <SimulationFrame
      className={css.simulationFrame}
      title={t("SIMULATION.TITLE")}
      directions={skyModelerDirections()} // ReactNode is also allowed if more complex content is needed.
      t={t}
      readAloudMode={false}
      handleSetReadAloud={noop}
    >
      <div className={css.content}>
        <div className={css.simulationContainer}>
          <SimulationView
            inputState={inputState}
            epochTime={epochTime}
            observerLat={OBSERVER_LAT}
            observerLon={OBSERVER_LON}
          />
        </div>
        <div className={css.bottomContainer}>
          <div className={css.controls}>
            <div className={css.row}>
              <div className={css.timeSliderContainer}>
                <Slider
                  value={inputState.timeOfDay}
                  min={0}
                  max={24}
                  step={1}
                  label={t("SIMULATION.TIME", { vars: { timeOfDay: timeToAMPM(inputState.timeOfDay, lang) } })}
                  onChange={handleTimeOfDayChange}
                  marks={sliderMarks}
                />
              </div>
            </div>
          <div className={css.row}>
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
      </div>
    </SimulationFrame>
  );
};

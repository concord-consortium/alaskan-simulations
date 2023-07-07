import React, { useCallback, useMemo, useRef } from "react";
import { Column } from "react-table";
import {
  SimulationFrame, NewRunButton, t, Table, IColumnMeta, useModelTable, useModelState, Button, Slider, Option, Select, LabeledContainer, ScrollingSelect, Mark, getDefaultLanguage
} from "common";
import clsx from "clsx";

import { SimulationView } from "./simulation/simulation-view";
import { IRowData, IModelInputState, IModelOutputState, Constellation, Month } from "../types";
import { formatTimeNumber, fractionalHourToTimeString, getConstellationAtTargetTime, monthLabel, timeToAMPM } from "../utils/sim-utils";
import { skyModelerDirections } from "./sky-modeler-directions";
import { Thumbnail } from "./thumbnail";

import CorrectIcon from "../assets/correct-icon.svg";
import IncorrectIcon from "../assets/incorrect-icon.svg";

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
  // Columns need to be initialized in Component function body, as otherwise the translation language files might
  // not be loaded yet.
  const columns: Column[] = useMemo(() => [
    {
      Header: t("TABLE_HEADER.PREDICTED_CONSTELLATION"),
      accessor: "predictedConstellation" as const,
      width: 120
    },
    {
      Header: t("TABLE_HEADER.MONTH"),
      accessor: "month" as const,
      width: 120
    },
    {
      Header: t("TABLE_HEADER.CONSTELLATION_AT_TARGET_TIME"),
      accessor: "constellationAtTargetTime" as const,
      width: 120
    },
    {
      Header: t("TABLE_HEADER.CONSTELLATION_MATCH"),
      accessor: "constellationMatch" as const,
      width: 120,
      Cell: ({ value }: { value: boolean }) => {
        return (
          <div className={value !== null ? (value ? css.correct : css.incorrect) : ""}>
            {value !== null && (value ? <CorrectIcon /> : <IncorrectIcon />)}
          </div>
        );
      }
    },
  ], []);

  const sliderMarks: Mark[] = [];
  for (let hour = 0; hour <= 24; hour++) {
    const label = (hour === 0) || (hour === 24) ? t("TIME.MIDNIGHT") : (hour === 12 ? t("TIME.NOON") : undefined);
    sliderMarks.push({value: hour, label});
  }

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState): IRowData => {
    const constellationAtTargetTime = runInputState.answerChecked && runInputState.month ? getConstellationAtTargetTime(runInputState.month) : null;
    return {
      predictedConstellation: runInputState.predictedConstellation ? t(runInputState.predictedConstellation) : "",
      month: runInputState.month ? t(monthLabel[runInputState.month]) : "",
      constellationAtTargetTime: constellationAtTargetTime ? t(constellationAtTargetTime) : "",
      constellationMatch: constellationAtTargetTime ? runInputState.predictedConstellation === constellationAtTargetTime : null
    };
  }, []);

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

  const handleCheck = () => {
    setInputState({ answerChecked: true, timeOfDay: 0 });
    setOutputState({ constellationMatch: constellationMatch() });
  };

  const handleTimeOfDayChange = (event: Event, value: number) => {
    setInputState({
      timeOfDay: value
    });
  };

  const handlePredictedConstellationChange = (value: string | null) => {
    setInputState({
      answerChecked: false,
      predictedConstellation: value as Constellation | null
    });
  };

  const handleMonthChange = (value: string | null) => {
    setInputState({
      answerChecked: false,
      month: Number(value) || 1
    });
  };

  const disableInputs = inputState.answerChecked && !!constellationMatch();
  const checkEnabled = inputState.month && inputState.predictedConstellation && !disableInputs;

  const date = new Date(getDateTimeString(inputState.month || 1, inputState.timeOfDay));
  const epochTime = date.getTime();

  const lang = getDefaultLanguage();

  return (
    <SimulationFrame
      title={t("SIMULATION.TITLE")}
      directions={skyModelerDirections()} // ReactNode is also allowed if more complex content is needed.
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
            <LabeledContainer className={css.monthAndConstellation} label={t("PREDICT_CONSTELLATION_PROMPT")} style="violet">
              <Thumbnail inputState={inputState} disabled={disableInputs} />
              <div className={css.selectContainer}>
                <div className={clsx(css.label, { [css.disabled]: disableInputs })}>{t("CONSTELLATION")}</div>
                <Select value={inputState.predictedConstellation} onChange={handlePredictedConstellationChange} placeholder={t("CHOOSE")} listLocation="above" disabled={disableInputs} style="violet">
                  <Option value={Constellation.Aquarius}>{t(Constellation.Aquarius)}</Option>
                  <Option value={Constellation.Aquila}>{t(Constellation.Aquila)}</Option>
                  <Option value={Constellation.Aries}>{t(Constellation.Aries)}</Option>
                  <Option value={Constellation.Cancer}>{t(Constellation.Cancer)}</Option>
                  <Option value={Constellation.Capricornus}>{t(Constellation.Capricornus)}</Option>
                  <Option value={Constellation.Gemini}>{t(Constellation.Gemini)}</Option>
                  <Option value={Constellation.Leo}>{t(Constellation.Leo)}</Option>
                  <Option value={Constellation.Libra}>{t(Constellation.Libra)}</Option>
                  <Option value={Constellation.Orion}>{t(Constellation.Orion)}</Option>
                  <Option value={Constellation.Pisces}>{t(Constellation.Pisces)}</Option>
                  <Option value={Constellation.Sagittarius}>{t(Constellation.Sagittarius)}</Option>
                  <Option value={Constellation.Scorpius}>{t(Constellation.Scorpius)}</Option>
                  <Option value={Constellation.Taurus}>{t(Constellation.Taurus)}</Option>
                  <Option value={Constellation.UrsaMajor}>{t(Constellation.UrsaMajor)}</Option>
                  <Option value={Constellation.Virgo}>{t(Constellation.Virgo)}</Option>
                </Select>
              </div>
              <div className={css.selectContainer}>
                <div className={clsx(css.label, { [css.disabled]: disableInputs })}>{t("MONTH")}</div>
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
            </LabeledContainer>
          </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};

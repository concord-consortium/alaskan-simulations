import React, { useMemo, useState } from "react";
import { SimulationFrame, TranslationContext, useModelState } from "common";
import { SimulationView } from "./simulation/simulation-view";
import { IModelInputState, IModelOutputState } from "../types";
import { formatTimeNumber, fractionalHourToTimeString } from "../utils/sim-utils";
import { skyModelerDirections } from "./sky-modeler-directions";
import { config } from "../config";
import { translations } from "../translations";
import { RouteContainer } from "./route-container";
import { BottomContainer } from "./bottom-container";

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

  const [readAloudMode, setReadAloudMode] = useState<boolean>(false);
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);

  const translationContextValues = useMemo(() => ({
    translations,
    readAloudMode,
    setReadAloudMode,
    isAnyAudioPlaying,
    setIsAnyAudioPlaying
  }), [isAnyAudioPlaying, readAloudMode]);

  const { inputState, setInputState } = modelState;

  const handleTimeOfDayChange = (value: number) => {
    setInputState({
      timeOfDay: value
    });
  };

  const handleMonthChange = (value: number) => {
    setInputState({
      month: value
    });
  };

  const date = new Date(getDateTimeString(inputState.month || 1, inputState.timeOfDay));
  const epochTime = date.getTime();

  return (
    <TranslationContext.Provider value={translationContextValues}>
      <SimulationFrame
        className={css.simulationFrame}
        directions={skyModelerDirections()} // ReactNode is also allowed if more complex content is needed.
      >
        <div className={css.content}>
          <div className={css.leftColumn}>
            <div className={css.simulationContainer}>
              <SimulationView
                inputState={inputState}
                epochTime={epochTime}
                observerLat={OBSERVER_LAT}
                observerLon={OBSERVER_LON}
              />
            </div>
            <BottomContainer
              inputState={inputState}
              disableInputs={false}
              onTimeOfDayChange={handleTimeOfDayChange}
              onMonthChange={handleMonthChange}
            />
          </div>
          {
            config.routeMap &&
            <div className={css.rightColumn}>
              <RouteContainer />
            </div>
          }
        </div>
      </SimulationFrame>
    </TranslationContext.Provider>
  );
};

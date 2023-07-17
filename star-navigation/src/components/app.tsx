import React, { useMemo, useState } from "react";
import { SimulationFrame, TranslationContext, useModelState } from "common";
import { SimulationView } from "./simulation/simulation-view";
import { IModelInputState, IModelOutputState } from "../types";
import { skyModelerDirections } from "./sky-modeler-directions";
import { config } from "../config";
import { getDateTimeString } from "../utils/sim-utils";
import { translations } from "../translations";
import { RouteContainer } from "./route-container";
import { BottomContainer } from "./bottom-container";
import HeaderTitle from "../assets/title.png";

import css from "./app.scss";

// Observer location is at Hooper Bay, Alaska.
const OBSERVER_LAT = 61.523997904;
const OBSERVER_LON = -166.090999636;

export const App: React.FC = () => {
  const modelState = useModelState<IModelInputState, IModelOutputState>(useMemo(() => ({
    initialInputState: {
      month: 1,
      day: 1,
      timeOfDay: 0,
      showWesternConstellations: true,
      showYupikConstellations: true,
      compassActive: false,
      selectedStarHip: null,
      realHeadingFromNorth: 90
    },
    initialOutputState: {
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

  const date = new Date(getDateTimeString(inputState.month, inputState.day, inputState.timeOfDay));
  const epochTime = date.getTime();

  return (
    <TranslationContext.Provider value={translationContextValues}>
      <SimulationFrame
        className={css.simulationFrame}
        titleImage={HeaderTitle}
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
                setInputState={setInputState}
              />
            </div>
            <BottomContainer
              inputState={inputState}
              setInputState={setInputState}
              disableInputs={false}
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

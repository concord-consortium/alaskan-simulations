import React, { useMemo, useState } from "react";
import { useInteractiveState } from "@concord-consortium/lara-interactive-api";
import { SimulationFrame, TranslationContext } from "common";
import { SimulationView } from "./simulation/simulation-view";
import { IInteractiveState, IModelInputState } from "../types";
import { skyModelerDirections } from "./sky-modeler-directions";
import { pointA, pointC } from "./right-container/route-map";
import { config } from "../config";
import { getDateTimeString } from "../utils/sim-utils";
import { translations } from "../translations";
import { RightContainer } from "./right-container/right-container";
import { BottomContainer } from "./bottom-container/bottom-container";
import HeaderTitle from "../assets/title.png";

import css from "./app.scss";

interface IProps {
  readOnly?: boolean;
}

const defaultInteractiveState: IInteractiveState = {
  answerType: "interactive_state",
  inputState: {
    month: 1,
    day: 1,
    timeOfDay: 0,
    showWesternConstellations: true,
    showYupikConstellations: true,
    realHeadingFromNorth: 90,
    assumedNorthStarHip: null,
    angleMarker: null,
    compassInteractionActive: false,
    angleMarkerInteractionActive: false,
    pointADepartureSnapshot: null,
    pointBArrivalSnapshot: null,
    pointBDepartureSnapshot: null,
    pointCArrivalSnapshot: null,
    journeyLeg: "AtoB",
    pointB: { x: (pointA.x + pointC.x) * 0.5, y: (pointA.y + pointC.y) * 0.5 },
    showUserTrip: false,
  },
  readAloudMode: false
};

const noop = () => (void 0);

export const App: React.FC<IProps> = ({ readOnly }) => {
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);
  const { interactiveState: rawInteractiveState, setInteractiveState } = useInteractiveState<IInteractiveState>();

  const interactiveState = rawInteractiveState || defaultInteractiveState;

  const translationContextValues = useMemo(() => ({
    translations,
    readAloudMode: interactiveState.readAloudMode,
    setReadAloudMode: (readAloudMode: boolean) => {
      setInteractiveState(prev => ({ ...(prev || defaultInteractiveState), readAloudMode }));
    },
    isAnyAudioPlaying,
    setIsAnyAudioPlaying
  }), [interactiveState.readAloudMode, isAnyAudioPlaying, setInteractiveState]);

  const inputState = interactiveState.inputState;
  const setInputState = readOnly ? noop : (newInputState: Partial<IModelInputState>) => {
    setInteractiveState(prev => ({
      ...(prev || defaultInteractiveState),
      inputState: {
        ...(prev || defaultInteractiveState).inputState,
        ...newInputState
      }
    }));
  };

  const date = new Date(getDateTimeString(inputState));
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
              <RightContainer
                inputState={inputState}
                setInputState={setInputState}
                disableInputs={false}
              />
            </div>
          }
        </div>
      </SimulationFrame>
    </TranslationContext.Provider>
  );
};

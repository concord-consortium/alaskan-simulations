import React, { useCallback, useMemo, useRef, useState } from "react";
import { useModelState } from "../hooks/use-model-state";
import { useSimulationRunner, SimulationFrame, useTranslation, TranslationContext } from "common";
import { useModelTable } from "../hooks/use-model-table";
import { translations } from "../translations";
import { Column } from "react-table";
import { IColumnMeta, Table } from "./table/table";
import { NewRunButton } from "./controls/new-run-button";
import { PlayButton } from "./controls/play-button";
import { TimeSlider } from "./controls/time-slider";
import { SimulationView } from "./simulation/simulation-view";
import { IRowData, IModelInputState, IModelOutputState, IInteractiveState, defaultInitialState, EQualitativeAmount, IAuthoredState, IAnimalData } from "../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
import { ClamFiltrationDirections } from "./clam-sim-directions";
import { initialFish } from "../utils/sim-utils";
import HeaderTitle from "../assets/HeaderTitle.png";

import css from "./app.scss";

const targetStepsPerSecond = 60;
const targetFramePeriod = 1000 / targetStepsPerSecond;
// Simulation length in real world seconds.
const simLength = 4; // s
const totalFrames = simLength * targetStepsPerSecond;
let lastStepTime:  number;
// Number of simulation state snapshots. totalFrames % (snapshotsCount - 1) should be equal to 0, so the last snapshot
// is taken exactly at the end of the simulation. -1, as the first snapshot is taken at the start of the simulation.
const snapshotsCount = 5;

const columnsMeta: IColumnMeta[] = [
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
];

interface IAppProps {
  interactiveState: IInteractiveState | null;
  authoredState?: IAuthoredState | null;
  readOnly?: boolean;
}

export const App = (props: IAppProps) => {
  const { interactiveState, readOnly } = props;
  // const { interactiveState: rawInteractiveState, setInteractiveState } = useInteractiveState<IInteractiveState>();
  const { startSimulation, endSimulation, isRunning } = useSimulationRunner();
  const [readAloudMode, setReadAloudMode] = useState<boolean>(interactiveState ? interactiveState.readAloudMode : defaultInitialState.readAloudMode);
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);
  // const interactiveState = useMemo(() => rawInteractiveState || defaultInteractiveState, [rawInteractiveState]);

  const translationContextValues = useMemo(() => ({
    translations,
    disabled: isRunning,
    readAloudMode,
    setReadAloudMode,
    isAnyAudioPlaying,
    setIsAnyAudioPlaying
  }), [isAnyAudioPlaying, isRunning, readAloudMode]);

  // Pass context values as props, as App component also defines TranslationContext.Provider, so it's not possible to
  // rely on context values from there.
  const { t } = useTranslation(translationContextValues);
  const monthLabelsTranslated = [t("MONTH_1"), t("MONTH_2"), t("MONTH_3"), t("MONTH_4"), t("MONTH_5")];
  // Columns need to be initialized in Component function body, as otherwise the translation language files might
  // not be loaded yet.
  const columns: Column[] = useMemo(() => [
    {
      Header: t("TABLE.HEADER_TRIAL"),
      accessor: "trial" as const,
      width: 40,
      disableSortBy: true
    },
    {
      Header: t("TABLE.HEADER_CLAMS"),
      accessor: "clams" as const,
      width: 75,
      disableSortBy: true
    },
    {
      Header: t("TABLE.HEADER_ALGAE"),
      accessor: "algae" as const,
      width: 150,
      disableSortBy: true
    },
    {
      Header: t("TABLE.HEADER_OUTPUT.NITRATE"),
      accessor: "nitrate" as const,
      width: 150,
      disableSortBy: true
    },
    {
      Header: t("TABLE.HEADER_OUTPUT.TURBIDITY"),
      accessor: "turbidity" as const,
      width: 150,
      disableSortBy: true
    },
  ], [t]);

  const modelState = useModelState(useMemo(() => ({
    initialInputState: interactiveState?.inputState || defaultInitialState.inputState,
    initialOutputState: interactiveState?.outputState || defaultInitialState.outputState,
    initialModelRuns: interactiveState?.modelRuns || defaultInitialState.modelRuns,
  }), [interactiveState]));

  const {
    inputState, setInputState, outputState, setOutputState, snapshotOutputState, isFinished, markRunFinished,
    setActiveOutputSnapshotIdx, addModelRun, activeOutputSnapshotIdx, activeRunIdx, isLastRunFinished
  } = modelState;

  const getNumToText = (num: number | null, type: string) => {
    if (num === null) return null;
    switch (type) {
      case "algae":
      case "turbidity":
        return num <= 30 ? t(EQualitativeAmount.low) : num >= 61 ? t(EQualitativeAmount.high) : t(EQualitativeAmount.medium);
      case "nitrate":
        return num <= 20 ? t(EQualitativeAmount.low) : num >= 36 ? t(EQualitativeAmount.high) : t(EQualitativeAmount.medium);
      default:
        return null;
    }
  };

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState, runIsFinished: boolean): IRowData => ({
    numClams: runInputState.numClams,
    algae: !isRunning && !runIsFinished ? null : getNumToText(runOutputState.algae, "algae"),
    nitrate: !isRunning && !runIsFinished ? null : getNumToText(runOutputState.nitrate, "nitrate"),
    turbidity: !isRunning && !runIsFinished ? null : getNumToText(runOutputState.turbidity, "turbidity"),
  }), [isRunning, t]);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  const getGraphData = (dataType: "algae" | "nitrate" | "turbidity") => {
    //This should return the data for the case type depending on inputs
    console.log("getGraphData");
    return modelState.modelRuns[modelState.activeRunIdx].outputStateSnapshots.map((snapshot) => snapshot[dataType]);
  };
  const getActiveX = () => {
    if (isFinished && (activeOutputSnapshotIdx !== null)) {
      return activeOutputSnapshotIdx * 4;
    } else if (isFinished) {
      return (modelState.modelRuns[activeRunIdx].outputStateSnapshots.length - 1) * 4;
    } else {
      return undefined;
    }
  };

  const uiDisabled = isRunning || isFinished;

  const handleStartSimulation = () => {
    const model = new Model(inputState);
    let frames = 0;
    // snapshotCounts - 1, as the initial snapshot is already saved.
    const snapshotInterval = totalFrames / (snapshotsCount - 1);

    lastStepTime = window.performance.now();


    const simulationStep = () => {
      // simple calculation to work out desired times we should step the model.
      // this could be made more complex by calculating the total number of steps we
      // expect to have reached so far.
      const now = window.performance.now();
      const dt = now - lastStepTime;
      lastStepTime = now;
      const steps = Math.max(1, Math.min(10, Math.round(dt / targetFramePeriod)));
      const modelSimulationState = model.getSimulationState();
      const getOutputState = (): IModelOutputState => ({
        time: model.time,
        algae: model.algae ,
        nitrate: model.nitrate,
        turbidity: model.turbidity,
      });
      for (let i = 0; i < steps; i++) {
        model.step();
        frames += 1;
        console.log("in simulation step", i);
        if (frames % snapshotInterval === 0) {
          snapshotOutputState(getOutputState());
        }
      }
      setOutputState(getOutputState());
      if (frames >= totalFrames) {
        console.log("in simulation end");
        endSimulation();
        markRunFinished();
      }
    };
    startSimulation(simulationStep);
  };

  // When a new row is added to the table, it also receives a focus. This is not desired, as users will have to
  // navigate through multiple elements before they get back to input widgets. To avoid this, we focus on the Play
  // button which is a reasonable choice and it's also near the inputs.
  const focusTargetAfterNewRun = useRef<HTMLButtonElement>(null);

  const handleAddModelRun = () => {
    addModelRun();
    // Timeout is necessary, as table will be re-rendered asynchronously.
    setTimeout(() => {
      focusTargetAfterNewRun.current?.focus();
    }, 150);
  };
  const monthLabels = ["May", "June", "July", "August", "September"];
  const time: number = parseInt((outputState.time).toFixed(0), 10) || 0;
  const getTimeSliderLabel = () => {
    const timeIdx = Math.max(Math.min(0, time), time);
    const monthLabel = monthLabels[timeIdx];
    // Translations only for months that user re-visits.
    return isRunning ? `Month : ${monthLabel}`
                      : <>{t("TIME_SLIDER_LABEL.MONTH")} {monthLabel}</>;
  };

  const getGraphTitle = () => {
    // We do not have translations for graph run when higher than 9th run.
    return activeRunIdx >= 9 ? `Trial ${activeRunIdx + 1} Graphs` : t(`GRAPHS.TRIAL_${activeRunIdx + 1}`);
  };
  const timeSliderLabel = getTimeSliderLabel();

  return (
    <TranslationContext.Provider value={translationContextValues}>
      <SimulationFrame
        className={css.simulationFrame}
        titleImage={HeaderTitle}
        directions={<ClamFiltrationDirections />} // ReactNode is also allowed if more complex content is needed.
      >
        <div className={css.content}>
          <div className={css.optionsContainer}>
            <OptionsView
              inputState={inputState}
              setInputState={setInputState}
              disabled={uiDisabled || !!readOnly}
            />
          </div>
          <div className={css.simulationContainer}>
            <SimulationView
              input={inputState}
              output={outputState}
              month={monthLabels[time]}
              isRunning={isRunning}
              isFinished={isFinished}
              readOnly={readOnly}
            />
            <div className={css.controls}>
              <PlayButton ref={focusTargetAfterNewRun} onClick={handleStartSimulation} disabled={isRunning || isFinished || readOnly} />
              <div className={css.timeSliderContainer}>
                <TimeSlider
                  label={timeSliderLabel}
                  snapshotsCount={snapshotsCount}
                  time={outputState.time}
                  onChange={setActiveOutputSnapshotIdx}
                  disabled={!isFinished || readOnly}
                />
              </div>
              <NewRunButton onClick={handleAddModelRun} disabled={!isLastRunFinished || readOnly} />
            </div>
          </div>
          <div className={css.tableContainer}>
            <Table<IRowData>
              {...tableProps}
              columns={columns}
              columnsMeta={columnsMeta}
              disabled={isRunning || !!readOnly}
              centerHeader={true}
              noWrapDeleteButton={true}
            />
          </div>
          <div className={css.lineGraphs}>
            <div className={css.header}>{getGraphTitle()}</div>
            <div className={css.body}>
              <div className={css.graphsContainer}>
                <div className={css.graphs}>
                  Line graphs go here
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimulationFrame>
    </TranslationContext.Provider>
  );
};

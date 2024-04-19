import React, { useCallback, useMemo, useRef, useState } from "react";
import { useModelState } from "../hooks/use-model-state";
import { useSimulationRunner, useTranslation, TranslationContext } from "common";
import { useModelTable } from "../hooks/use-model-table";
import { translations } from "../translations";
import { Column } from "react-table";
import { IColumnMeta, Table } from "./table/table";
import { NewRunButton } from "./controls/new-run-button";
import { PlayButton } from "./controls/play-button";
import { TimeSlider } from "./controls/time-slider";
import { SimulationFrame } from "./simulation/simulation-frame";
import { SimulationView } from "./simulation/simulation-view";
import { IRowData, IModelInputState, IModelOutputState, IInteractiveState, IAuthoredState, defaultInitialState, Amount, amountLabels, clamLabels } from "../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
import { ClamFiltrationDirections } from "./clam-sim-directions";
import HeaderTitle from "../assets/HeaderTitle.png";

import css from "./app.scss";

const targetStepsPerSecond = 60;
const targetFramePeriod = 1000 / targetStepsPerSecond;
// Simulation length in real world seconds.
const simLength = 8; // s
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

const defaultInteractiveState: IInteractiveState = {
  answerType: "interactive_state",
  inputState: {
    algaeStart: Amount.Medium,
    numClams: Amount.Medium
  },
  outputState: {
    time: 0,
    algaeEnd: Amount.Low,
    nitrate: Amount.Low,
    turbidity: Amount.Low
  },
  modelRuns: [],
  readAloudMode: false
};

export const App = (props: IAppProps) => {
  const { interactiveState, readOnly } = props;
  const { startSimulation, endSimulation, isRunning } = useSimulationRunner();
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);
  const [readAloudMode, setReadAloudMode] = useState<boolean>(interactiveState ? interactiveState.readAloudMode : defaultInitialState.readAloudMode);

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
      accessor: "numClams" as const,
      width: 75,
      disableSortBy: true
    },
    {
      Header: t("TABLE.HEADER_ALGAE"),
      accessor: "algaeEnd" as const,
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
        return num <= 30 ? Amount.Low : num >= 61 ? Amount.High : Amount.Medium;
      case "nitrate":
        return num <= 20 ? Amount.Low : num >= 36 ? Amount.High : Amount.Medium;
      default:
        return null;
    }
  };

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState, runIsFinished: boolean): IRowData => ({
    numClams: !isRunning && !runIsFinished ? "" : t(clamLabels[runInputState.numClams]),
    algaeEnd: !isRunning && !runIsFinished ? "" : t(amountLabels[runOutputState.algaeEnd]),
    nitrate: !isRunning && !runIsFinished ? "" : t(amountLabels[runOutputState.nitrate]),
    turbidity: !isRunning && !runIsFinished ? "" : t(amountLabels[runOutputState.turbidity]),
  }), [isRunning, t]);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  const getGraphData = (inputs: IModelInputState) => {
    //This should return the data for the case type depending on inputs
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

  const graphData = getGraphData({"algaeStart": Amount.Medium, "numClams": Amount.Medium});

  const uiDisabled = isRunning || isFinished;

  const handleStartSimulation = () => {
    const model = new Model(inputState);
    let frames = 0;
    // snapshotCounts - 1, as the initial snapshot is already saved.
    const snapshotInterval = totalFrames / (snapshotsCount - 1);

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
        algaeEnd: model.algae ,
        nitrate: model.nitrate,
        turbidity: model.turbidity,
      });
      for (let i = 0; i < steps; i++) {
        model.step();
        frames += 1;
        if (frames % snapshotInterval === 0) {
          snapshotOutputState(getOutputState());
        }
      }
      setOutputState(getOutputState());
      if (frames >= totalFrames) {
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
  const timeIdx = Math.min(Math.floor(time / 2), monthLabels.length - 1);

  const getTimeSliderLabel = () => {
    const _time = outputState.time;
    const segments = monthLabels.length - 1; // number of dots, which is one less than number of months

    // we add a very small number before applying Math.floor to handle edge cases
    // this ensures the last label is only used at the end (1.0)
    const monthIndex = Math.floor((_time * segments) + 0.0001);

    const timeLabel = monthLabels[monthIndex];
    return <>{t("TIME_SLIDER_LABEL.MONTH")} {timeLabel}</>;
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
        directions={<ClamFiltrationDirections />}
      >
        <div className={css.content}>
          <div className={css.optionsContainer}>
            <OptionsView
              inputState={inputState}
              setInputState={setInputState}
              setOutputState={setOutputState}
              disabled={uiDisabled || !!readOnly}
            />
          </div>
          <div className={css.rightSide}>
            <div className={css.top}>
              <div className={css.simulationContainer}>
                <SimulationView
                  input={inputState}
                  output={outputState}
                  month={monthLabels[timeIdx]}
                  isRunning={isRunning}
                  isFinished={isFinished}
                  readOnly={readOnly}
                />
                <div className={css.controls}>
                  <div className={css.group}>
                    <NewRunButton onClick={handleAddModelRun} disabled={!isLastRunFinished || readOnly} />
                    <PlayButton ref={focusTargetAfterNewRun} onClick={handleStartSimulation} disabled={isRunning || isFinished || readOnly} />
                  </div>
                  <div className={css.timeSliderContainer}>
                    <TimeSlider
                      label={timeSliderLabel}
                      snapshotsCount={snapshotsCount}
                      time={outputState.time}
                      onChange={setActiveOutputSnapshotIdx}
                      disabled={!isFinished || readOnly}
                    />
                  </div>
                </div>
              </div>
              <div className={css.tableContainer}>
                <Table<IRowData>
                  {...tableProps}
                  columns={columns}
                  columnsMeta={columnsMeta}
                  disabled={isRunning || !!readOnly}
                  centerHeader={true}
                />
              </div>
            </div>
            <div className={css.bottom}>
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
          </div>
        </div>
      </SimulationFrame>
    </TranslationContext.Provider>
  );
};

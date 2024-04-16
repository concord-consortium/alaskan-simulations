import React, { useCallback, useMemo, useRef, useState } from "react";
import { useInteractiveState } from "@concord-consortium/lara-interactive-api";
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
import { IRowData, IModelInputState, IModelOutputState, IInteractiveState, IAuthoredState, defaultInitialState, EQualitativeAmount } from "../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
import { ClamFiltrationDirections } from "./clam-sim-directions";
import HeaderTitle from "../assets/HeaderTitle.png";

import css from "./app.scss";

const targetStepsPerSecond = 60;
const targetFramePeriod = 1000 / targetStepsPerSecond;
// Simulation length in real world seconds.
const simLength = 6; // s
const totalFrames = simLength * targetStepsPerSecond;
// Number of simulation state snapshots. totalFrames % (snapshotsCount - 1) should be equal to 0, so the last snapshot
// is taken exactly at the end of the simulation. -1, as the first snapshot is taken at the start of the simulation.
const snapshotsCount = 5;

const columnsMeta: IColumnMeta[] = [
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
];

interface IAppProps {
  interactiveState: IInteractiveState | null;
  readOnly?: boolean;
}

const defaultInteractiveState: IInteractiveState = {
  answerType: "interactive_state",
  inputState: {
    algaeStart: EQualitativeAmount.medium,
    numClams: 5
  },
  outputState: {
    time: 0,
    algaeEnd: EQualitativeAmount.high,
    nitrate: EQualitativeAmount.high,
    turbidity: EQualitativeAmount.high
  },
  modelRuns: [],
  readAloudMode: false
};

export const App = (props: IAppProps) => {
  const { readOnly } = props;
  const { interactiveState: rawInteractiveState, setInteractiveState } = useInteractiveState<IInteractiveState>();
  const { startSimulation, endSimulation, isRunning } = useSimulationRunner();
  const [readAloudMode, setReadAloudMode] = useState<boolean>(defaultInitialState.readAloudMode);
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);
  const interactiveState = useMemo(() => rawInteractiveState || defaultInteractiveState, [rawInteractiveState]);

  const translationContextValues = useMemo(() => ({
    translations,
    disabled: isRunning,
    readAloudMode: interactiveState.readAloudMode,
    setReadAloudMode: (hasReadAloud: boolean) => {
      setInteractiveState(prev => ({ ...(prev || defaultInteractiveState), hasReadAloud }));
    },    isAnyAudioPlaying,
    setIsAnyAudioPlaying
  }), [isAnyAudioPlaying, isRunning, readAloudMode]);

  // Pass context values as props, as App component also defines TranslationContext.Provider, so it's not possible to
  // rely on context values from there.
  const { t } = useTranslation(translationContextValues);
  const monthLabels = [t("MONTH_1"), t("MONTH_2"), t("MONTH_3"), t("MONTH_4"), t("MONTH_5")];

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
    setActiveOutputSnapshotIdx, addModelRun, activeRunIdx, isLastRunFinished
  } = modelState;


  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState, runIsFinished: boolean): IRowData => ({
    numClams: runInputState.numClams,
    algaeEnd: runOutputState.algaeEnd,
    nitrate: runOutputState.nitrate,
    turbidity: runOutputState.turbidity,
  }), [isRunning, t]);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  const getGraphData = (inputs: IModelInputState) => {
    //This should return the data for the case type depending on inputs
    console.log("getGraphData");
  };

  const graphData = getGraphData({"algaeStart": EQualitativeAmount.medium, "numClams": 5});

  const uiDisabled = isRunning || isFinished;

  const handleStartSimulation = () => {
    const model = new Model(inputState);

    let frames = 0;
    // snapshotCounts - 1, as the initial snapshot is already saved.
    const snapshotInterval = totalFrames / (snapshotsCount - 1);

    const getOutputState = (): IModelOutputState => ({
      time: model.time,
      algaeEnd: EQualitativeAmount.high,
      nitrate: EQualitativeAmount.high,
      turbidity: EQualitativeAmount.high
    });

    const simulationStep = (realTimeDiff: number) => {
      const stepFrames = Math.max(1, Math.min(10, Math.round(realTimeDiff / targetFramePeriod)));

      for (let i = 0; i < stepFrames; i++) {
        model.step(1 / totalFrames);
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

  const getTimeSliderLabel = () => {
    //TODO need to fix this to show the correct month at the correct time
    const time = outputState.time;
    const timeLabel = monthLabels[time]

    return <>{t("TIME_SLIDER_LABEL.MONTH")} {timeLabel}</>;
  };

  const getGraphTitle = () => {
    // We do not have translations for graph run when higher than 9th run.
    return activeRunIdx >= 9 ? `Trial ${activeRunIdx + 1} Graphs` : t(`GRAPHS.TRIAL_${activeRunIdx + 1}`);
  };

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
                  label={getTimeSliderLabel()}
                  time={outputState.time}
                  snapshotsCount={snapshotsCount}
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

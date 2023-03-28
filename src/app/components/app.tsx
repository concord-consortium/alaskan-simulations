import React, { useCallback, useMemo, useRef } from "react";
import { Column } from "react-table";
import { useModelState } from "./hooks/use-model-state";
import { useSimulationRunner } from "./hooks/use-simulation-runner";
import { useModelTable } from "./hooks/use-model-table";
import { IColumnMeta, Table } from "./table/table";
import { SimulationFrame } from "./simulation-frame/simulation-frame";
import { NewRunButton } from "./controls/new-run-button";
import { PlayButton } from "./controls/play-button";
import { TimeSlider } from "./controls/time-slider";
import { t } from "../translation/translate";
import { SimulationView } from "./simulation/simulation-view";
import { IRowData, IModelInputState, IModelOutputState, IInteractiveState, IAuthoredState, defaultInitialState, OutputAmount, InputAmount, OutputAmountValue } from "../../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
import { BarGraph } from "./bar-graph/bar-graph";
import { plantLabDirections} from "./plant-lab-directions";
import None from "../assets/input-none.png";
import Some from "../assets/input-some.png";
import Full from "../assets/input-full.png";

import css from "./app.scss";

const targetStepsPerSecond = 60;
const targetFramePeriod = 1000 / targetStepsPerSecond;
// Simulation length in real world seconds.
const simLength = 7; // s
const totalFrames = simLength * targetStepsPerSecond;
// Number of simulation state snapshots. totalFrames % (snapshotsCount - 1) should be equal to 0, so the last snapshot
// is taken exactly at the end of the simulation. -1, as the first snapshot is taken at the start of the simulation.
const snapshotsCount = 8;

const maxDays = 14;
const maxDaysScale = 2; //this helps us show 28 as max days instead of 14

const columnsMeta: IColumnMeta[] = [
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
  { numeric: false },
];

interface IAppProps {
  interactiveState: IInteractiveState|null;
  authoredState: IAuthoredState|null;
  readOnly?: boolean;
}

export const App = (props: IAppProps) => {
  const {interactiveState, readOnly} = props;

  // Columns need to be initialized in Component function body, as otherwise the translation language files might
  // not be loaded yet.
  const columns: Column[] = useMemo(() => [
    {
      Header: "Trial",
      accessor: "trial" as const,
      width: 60
    },
    {
      Header: "Light",
      accessor: "light" as const,
      width: 75,
    },
    {
      Header: "Water",
      accessor: "water" as const,
      width: 75,
    },
    {
      Header: <div style={{marginBottom:"-3px"}}><span>CO<sub>2</sub></span></div>,
      accessor: "co2" as const,
      width: 75,
    },
    {
      Header: "Sugar Used",
      accessor: "sugarUsed" as const,
      width: 150
    },
    {
      Header: "Sugar Produced",
      accessor: "sugarProduced" as const,
      width: 155
    },
  ], []);

  const modelState = useModelState(useMemo(() => ({
    initialInputState: interactiveState?.inputState || defaultInitialState.inputState,
    initialOutputState: interactiveState?.outputState || defaultInitialState.outputState,
    initialModelRuns: interactiveState?.modelRuns || defaultInitialState.modelRuns,
  }), [interactiveState]));

  const { startSimulation, endSimulation, isRunning } = useSimulationRunner();

  const {
    inputState, setInputState, outputState, setOutputState, snapshotOutputState, isFinished, markRunFinished,
    setActiveOutputSnapshotIdx, addModelRun, activeOutputSnapshotIdx, activeRunIdx
  } = modelState;

  const getPng = (inputLevel: string) => {
    if (inputLevel === InputAmount.None) {
      return <img src={None}/>;
    } else if (inputLevel === InputAmount.Some) {
      return <img src={Some}/>;
    } else {
      return <img src={Full}/>;
    }
  };

  const convertNumberToText = (amount: number) => {
    if (amount < OutputAmountValue.Low) {
      return OutputAmount.None;
    } else if (amount < OutputAmountValue.Medium) {
      return OutputAmount.Low;
    } else if (amount < OutputAmountValue.High) {
      return OutputAmount.Medium;
    } else  {
      return OutputAmount.High;
   }
  };

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState, runIsFinished: boolean): IRowData => ({
    light: getPng(runInputState.light),
    water: getPng(runInputState.water),
    co2: getPng(runInputState.co2amount),
    sugarUsed: !isRunning && !runIsFinished ? "" : t(convertNumberToText(runOutputState.sugarUsed)),
    sugarProduced: !isRunning && !runIsFinished ? "" : t(convertNumberToText(runOutputState.sugarProduced))
  }), [isRunning]);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  const getGraphData = (dataType: "sugarUsed" | "sugarProduced") => {
    return modelState.modelRuns[modelState.activeRunIdx].outputStateSnapshots.map((snapshot) => snapshot[dataType]);
  };

  const sugarUsedData = getGraphData("sugarUsed");
  const sugarCreatedData = getGraphData("sugarProduced");

  const getActiveX = () => {
    if (isFinished && activeOutputSnapshotIdx === 0) {
      return 1;
    } else if (isFinished && activeOutputSnapshotIdx) {
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

    const getOutputState = (): IModelOutputState => ({
      time: model.time,
      sugarUsed: model.sugarUsed,
      sugarProduced: model.sugarProduced
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

  return (
    <SimulationFrame
      title={t("SIMULATION.TITLE")}
      directions={plantLabDirections()} // ReactNode is also allowed if more complex content is needed.
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
          />
          <div className={css.controls}>
            <div className={css.group}>
              <NewRunButton onClick={handleAddModelRun} disabled={!isFinished || readOnly} />
              <PlayButton ref={focusTargetAfterNewRun} onClick={handleStartSimulation} disabled={isRunning || isFinished || readOnly} />
            </div>
            <div className={css.grow}>
              <div className={css.timeSliderContainer}>
                <TimeSlider
                  label={t("SIMULATION.TIME", {vars: {days: `${(maxDaysScale * maxDays * outputState.time).toFixed(0)}`}})}
                  time={outputState.time}
                  snapshotsCount={snapshotsCount}
                  onChange={setActiveOutputSnapshotIdx}
                  disabled={!isFinished || readOnly}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={css.tableGraphsColumn}>
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
          <div className={css.barGraphs}>
            <div className={css.header}>{`Trial ${activeRunIdx + 1} Graphs`}</div>
            <div className={css.body}>
              <div className={css.graphsContainer}>
                <BarGraph
                  data={sugarUsedData}
                  title={"Sugar Used"}
                  activeXTick={getActiveX()}
                  className={"sugarUsed"}
                />
                <BarGraph
                  data={sugarCreatedData}
                  title={"Sugar Produced"}
                  activeXTick={getActiveX()}
                  className="sugarProduced"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};

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
import { IRowData, IModelInputState, IModelOutputState, IInteractiveState, IAuthoredState, defaultInitialState, OutputAmount, InputAmount } from "../../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
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
    },
    {
      Header: "Sugar Produced",
      accessor: "sugarProduced" as const,
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
    setActiveOutputSnapshotIdx, addModelRun
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

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState): IRowData => ({
    light: getPng(runInputState.light),
    water: getPng(runInputState.water),
    co2: getPng(runInputState.co2amount),
    sugarUsed: runOutputState.sugarUsed as OutputAmount,
    sugarCreated: runOutputState.sugarCreated as OutputAmount
  }), []);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  // const { graphProps } = useModelGraph<IModelInputState, IModelOutputState>({
  //   modelState,
  //   selectedRuns: tableProps.selectedRows || {},
  //   outputStateToDataPoint: useCallback((output: IModelOutputState) =>
  //     ({
  //       waterMassChange: typeof output.waterMassChange === "string" ? 0 : output.waterMassChange,
  //       light: typeof output.lightChange === "string" ? 0 : output.lightChange,
  //       co2Change: typeof output.co2Change === "string" ? 0 : output.co2Change,
  //       plantChange: typeof output.plantChange.change === "string" ? 0 : output.plantChange.change,
  //     })
  //   , [])
  // });

  const uiDisabled = isRunning || isFinished;

  const handleStartSimulation = () => {
    const model = new Model(inputState);

    let frames = 0;
    // snapshotCounts - 1, as the initial snapshot is already saved.
    const snapshotInterval = totalFrames / (snapshotsCount - 1);

    const getOutputState = (): IModelOutputState => ({
      time: model.time,
      sugarUsed: model.sugarUsed as OutputAmount,
      sugarCreated: model.sugarCreated as OutputAmount
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

    // select the graph button for the active row
    tableProps.onSelectedRowsChange({[tableProps.activeRow]: "selected1"});

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
          <div className={css.barGraphContainer}>
            <div className={css.marginBlock}/>
            {/* <BarGraph
              {...graphProps} // `data` and `barStyles` at this point
              title= {<GraphTitle days={`${(maxDaysScale * maxDays * outputState.time).toFixed(0)}`}/>}
              yAxisLabel={t("GRAPH.Y_AXIS")}
              yAxisLabelHeight={lang === "es" ? 107 : undefined}
              xTicks={ // Note that xTick `val` should match keys of the object returned in `outputStateToDataPoint`.
                [
                  {val: "light", label: <p key={`BGSoil`} style={{fontWeight: 800, marginTop:"0px"}}> {t("TABLE_HEADER.LIGHT")} </p>},
                  {val: "waterMassChange", label: <p key={`BGWater`}style={{fontWeight: 800, marginTop:"0px"}}> {t("TABLE_HEADER.WATER")} </p> },
                  {val: "co2Change", label: <div key={`BGCO2`} style={{fontWeight: 800, marginTop:"-10px"}}> <span key={`BGCO2Span`}>CO<sub>2</sub></span> </div>,},
                  {val: "plantChange", label: <p key={`BGPlants`}style={{fontWeight: 800, marginTop:"0px"}}> {t("TABLE_HEADER.PLANTS")} </p>},
                ]
              }
              yMin={-4}
              yMax={4}
              yGridStep={1}
              yTicks={
                [
                  {
                    val: -4,
                    label:
                      <>
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                      </>
                  },
                  {
                    val: -2,
                    label:
                      <>
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                        <img src={DownArrow} className={css.barGraphScaleArrow} />
                      </>
                  },
                  {
                    val: 0,
                    label: 0
                  },
                  {
                    val: 2,
                    label:
                      <>
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                      </>
                  },
                  {
                    val: 4,
                    label:
                      <>
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                        <img src={UpArrow} className={css.barGraphScaleArrow} />
                      </>
                  }
                ]
              }
              activeXTick = {isRunning ? Math.floor(roundedTime * maxDays / 2) : Math.round((linearMap(0, 1, 0, 7, roundedTime)))}
              // X xis uses property names instead of time .
              timeBased={false}
              // Y=0 is in the middle of the graph.
              centeredZero={true}
              minorLinesHalfThick={true}
            /> */}
          </div>

        </div>
      </div>
    </SimulationFrame>
  );
};

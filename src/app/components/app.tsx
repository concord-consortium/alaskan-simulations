import React, { useCallback, useMemo, useRef } from "react";
import { Column } from "react-table";
import { useModelState } from "./hooks/use-model-state";
import { useSimulationRunner } from "./hooks/use-simulation-runner";
import { useModelTable } from "./hooks/use-model-table";
import { useModelGraph } from "./hooks/use-model-graph";
import { BarGraph } from "./bar-graph/bar-graph";
import { IColumnMeta, Table } from "./table/table";
import { SimulationFrame } from "./simulation-frame/simulation-frame";
import { NewRunButton } from "./controls/new-run-button";
import { PlayButton } from "./controls/play-button";
import { TimeSlider } from "./controls/time-slider";
import { t, getDefaultLanguage } from "../translation/translate";
import { SimulationView } from "./simulation/simulation-view";
import { IRowData, IModelInputState, IModelOutputState, IPlantChange, CO2Amount, IInteractiveState, IAuthoredState, defaultInitialState } from "../../types";
import { Model } from "./model";
import { OptionsView } from "./options-view";
import { GraphTitle } from "./graph-title";
import UpArrow from "../assets/arrow-increase.png";
import DownArrow from "../assets/arrow-decrease.png";
import { plantLabDirections} from "./plant-lab-directions";
import { linearMap } from "../utils/sim-utils";

import css from "./app.scss";
import clsx from "clsx";

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
  { graphSelection: true },
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
      // Header: t("TABLE_HEADER.STARTING_CONDITIONS"),
      Header: "", //this is to demonstrate the row height shrinks to 10
      accessor: "startingConditions" as const,
      width: 130,

    },
    {
      Header: t("TABLE_HEADER.LIGHT"),
      accessor: "lightChange" as const,
      width: 100,
      Cell: ({ value }: { value: number }) => numberToJSX(value)
    },
    {
      Header: t("TABLE_HEADER.WATER"),
      accessor: "waterMassChange" as const,
      width: 100,
      Cell: ({ value }: { value: number | string }) => numberToJSX(value),
    },
    {
      Header: <div style={{marginBottom:"-3px"}}><span>CO<sub>2</sub></span></div>,
      accessor: "co2Change" as const,
      width: 100,
      Cell: ({ value }: { value: number }) => numberToJSX(value)
    },
    {
      Header: t("TABLE_HEADER.PLANTS"),
      accessor: "plantChange" as const,
      width: 100,
      Cell: ({ value }: { value: IPlantChange }) => numberToJSX(value.change),
      sortType: (rowA, rowB, columnId) => {
        const a = rowA.values[columnId].change;
        const b = rowB.values[columnId].change;
        return a-b;
      },

    },
  ], []);

  function numberToJSX(value: number | string){
      switch (value){
        case -2:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellDownArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellDownArrow1} style={{marginLeft:"-8px"}}/>
            </div>
          );
          break;
        case -1.5:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellDownArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellDownArrowHalf} style={{marginLeft:"-8px"}}/>
            </div>
          );
          break;
        case -1:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellDownArrow1}/>
            </div>
          );
          break;
        case -0.5:

          return (
            <div className={css.flexContainer}>
              <div className={css.cellDownArrowHalf}/>
            </div>
          );
          break;

        case 0.5:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrowHalf}/>
            </div>
          );
          break;
        case 1:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrow1}/>
            </div>
          );
          break;
        case 1.5:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellUpArrowHalf} style={{marginLeft:"-8px"}}/>
            </div>
          );
          break;
        case 2:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginLeft:"-8px"}}/>
            </div>
          );
          break;
        case 3:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px", marginLeft:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginLeft: "-8px"}}/>
            </div>
          );
          break;
        case 4:
          return (
            <div className={css.flexContainer}>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px", marginLeft:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginRight:"-8px", marginLeft:"-8px"}}/>
              <div className={css.cellUpArrow1} style={{marginLeft: "-8px"}}/>
            </div>
          );
          break;

        default: //for 0 and --
          return <span> {value} </span>;
          break;
      }
  }

  const lang = getDefaultLanguage();

  const modelState = useModelState(useMemo(() => ({
    initialInputState: interactiveState?.inputState || defaultInitialState.inputState!,
    initialOutputState: interactiveState?.outputState || defaultInitialState.outputState!,
    initialModelRuns: interactiveState?.modelRuns || defaultInitialState.modelRuns!,
  }), [interactiveState]));

  const { startSimulation, endSimulation, isRunning } = useSimulationRunner();

  const {
    inputState, setInputState, outputState, setOutputState, snapshotOutputState, isFinished, markRunFinished,
    setActiveOutputSnapshotIdx, addModelRun
  } = modelState;

  const modelRunToRow = useCallback((runInputState: IModelInputState, runOutputState: IModelOutputState): IRowData => ({
    startingConditions:<div>
                          <div>{t("TABLE_HEADER.LIGHT")}: {t(runInputState.light)} </div>
                          <div>{t("TABLE_HEADER.WATER")}: {t(runInputState.water)} </div>
                          <div> <span>CO<sub>2</sub></span>: {t(runInputState.co2amount)}</div>
                       </div> ,
    lightChange: (runOutputState.time === 0) ? (runInputState.light) ? 0: "-- " : runOutputState.lightChange,
    waterMassChange: (runOutputState.time === 0) ? (runInputState.water) ? 0: "-- " : runOutputState.waterMassChange,
    co2Change: (runOutputState.time === 0) ? (runInputState.co2amount !== CO2Amount.None) ? 0: "-- " : runOutputState.co2Change,
    plantChange: runOutputState.plantChange
  }), []);

  const { tableProps } = useModelTable<IModelInputState, IModelOutputState, IRowData>({ modelState, modelRunToRow });

  const { graphProps } = useModelGraph<IModelInputState, IModelOutputState>({
    modelState,
    selectedRuns: tableProps.selectedRows || {},
    outputStateToDataPoint: useCallback((output: IModelOutputState) =>
      ({
        waterMassChange: typeof output.waterMassChange === "string" ? 0 : output.waterMassChange,
        light: typeof output.lightChange === "string" ? 0 : output.lightChange,
        co2Change: typeof output.co2Change === "string" ? 0 : output.co2Change,
        plantChange: typeof output.plantChange.change === "string" ? 0 : output.plantChange.change,
      })
    , [])
  });

  const uiDisabled = isRunning || isFinished;

  const handleStartSimulation = () => {
    const model = new Model(inputState);

    let frames = 0;
    // snapshotCounts - 1, as the initial snapshot is already saved.
    const snapshotInterval = totalFrames / (snapshotsCount - 1);

    const getOutputState = (): IModelOutputState => ({
      time: model.time,
      lightChange: model.lightChange,
      waterMassChange: model.waterMassChange,
      co2Change: model.co2Change,
      plantChange: model.plantChange,
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

  //CSS Styles for HeaderGroupTitle
  const emptyCellStyle: React.CSSProperties = {
    height: "10px",
  };
  const startingConditionsStyle: React.CSSProperties = {
    height:"10px",
    textAlign:"left"
  };
  const changeInMassStyle: React.CSSProperties = {
    height: "10px",
    textAlign:"center"
  };
  const customStyles = [emptyCellStyle, startingConditionsStyle, changeInMassStyle];
  //used for rounding the activeXTick
  const expectedPrecision = 1000;
  const roundedTime = Math.round(outputState.time * expectedPrecision) / expectedPrecision;


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
              customHeader={(
                <div className={clsx(css.key, css[lang])}>
                  <div className={css.keyTitleContainer}>
                    <p className={css.keyTitle}> {t("TABLE_HEADER_KEY.KEY")} </p>
                  </div>
                  <div className={css.upArrowContainer}>
                    <img src={UpArrow} className={css.upArrowImg}/>
                    <p className={css.upArrowTitle}> {t("TABLE_HEADER_KEY.INCREASE")} </p>
                  </div>
                  <div className={css.downArrowContainer}>
                    <img src={DownArrow} className={css.downArrowImg}/>
                    <p className={css.downArrowTitle}> {t("TABLE_HEADER_KEY.DECREASE")} </p>
                  </div>
                </div>
              )}
              headerGroupTitle={customStyles}
              centerHeader={true}
              noWrapDeleteButton={true}
            />
          </div>
          <div className={css.barGraphContainer}>
            <div className={css.marginBlock}/>
            <BarGraph
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
            />
          </div>

        </div>
      </div>
    </SimulationFrame>
  );
};

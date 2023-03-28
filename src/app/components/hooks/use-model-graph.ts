import { useMemo } from "react";
import { GraphDatasetStyle, IBarGraphProps } from "../bar-graph/bar-graph";
import { IUseModelStateResult } from "./use-model-state";

export interface IUseModelGraphOptions<IModelInputState, IModelOutputState> {
  modelState: IUseModelStateResult<IModelInputState, IModelOutputState>;
  outputStateToDataPoint: (outputState: IModelOutputState) => number;
}

export interface IUseModelGraphResult {
  data: number[];
}

/*
 * This hook is a bridge between (Bar)Graph component and useModelState hook. It maps useModelState state to graph data.
 */
export const useModelGraph = <IModelInputState, IModelOutputState>(
  options: IUseModelGraphOptions<IModelInputState, IModelOutputState>
): IUseModelGraphResult => {
  const { modelState, outputStateToDataPoint } = options;

  const data = useMemo(() =>
      modelState.modelRuns[modelState.activeRunIdx].outputStateSnapshots.map(outputStateToDataPoint)
  , [modelState.modelRuns, modelState.activeRunIdx, outputStateToDataPoint]);


  return {
    data
  };
};

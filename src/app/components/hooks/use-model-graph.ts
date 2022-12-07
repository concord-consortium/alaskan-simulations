import { useMemo } from "react";
import { GraphDatasetStyle, IBarGraphProps } from "../bar-graph/bar-graph";
import { SelectedRows, SelectedRowStyleName } from "../table/table";
import { IUseModelStateResult } from "./use-model-state";

export interface IUseModelGraphOptions<IModelInputState, IModelOutputState> {
  modelState: IUseModelStateResult<IModelInputState, IModelOutputState>;
  selectedRuns: SelectedRows;
  outputStateToDataPoint: (outputState: IModelOutputState) => number | Record<string, number>;
}

export interface IUseModelGraphResult {
  graphProps: Pick<IBarGraphProps, "data" | "barStyles">;
}

const tableStyleToGraphStyle: Record<SelectedRowStyleName, GraphDatasetStyle> = {
  "selected1": "data1",
  "selected2": "data2"
};

/*
 * This hook is a bridge between (Bar)Graph component and useModelState hook. It maps useModelState state to graph data.
 */
export const useModelGraph = <IModelInputState, IModelOutputState>(
  options: IUseModelGraphOptions<IModelInputState, IModelOutputState>
): IUseModelGraphResult => {
  const { modelState, selectedRuns, outputStateToDataPoint } = options;

  const data = useMemo(() =>
    Object.keys(selectedRuns)
      // First, check if data exists, selectedRuns might be out of sync for a while when run is being deleted.
      .filter(runIdx => !!modelState.modelRuns[Number(runIdx)])
      .map(runIdx =>
        modelState.modelRuns[Number(runIdx)].outputStateSnapshots.map(outputStateToDataPoint)
      )
  , [modelState.modelRuns, outputStateToDataPoint, selectedRuns]);

  const barStyles = useMemo(() =>
    Object.keys(selectedRuns)
      // First, check if data exists, selectedRuns might be out of sync for a while when run is being deleted.
      .filter(runIdx => !!modelState.modelRuns[Number(runIdx)])
      .map(runIdx => tableStyleToGraphStyle[selectedRuns[Number(runIdx)]])
  , [modelState.modelRuns, selectedRuns]);

  return {
    graphProps: {
      data,
      barStyles
    }
  };
};

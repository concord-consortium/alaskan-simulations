import { useMemo } from "react";
import { ITableProps } from "../table/table";
import { IUseModelStateResult } from "./use-model-state";

export interface IUseModelTableOptions<IModelInputState, IModelOutputState, IRowData> {
  modelState: IUseModelStateResult<IModelInputState, IModelOutputState>;
  modelRunToRow: (inputState: IModelInputState, outputState: IModelOutputState, isFinished: boolean) => IRowData;
}

export interface IUseModelTableResult<IRowData> {
  tableProps: Omit<ITableProps<IRowData>, "disabled" | "columns" | "columnsMeta">;
}

/*
 * This hook is a bridge between Table component and useModelState hook. It maps useModelState helpers and states
 * to table React props. It's useful to keep it in a hook rather than in App component, so future updates can be easily
 * shared with all the simulations.
 */
export const useModelTable = <IModelInputState, IModelOutputState, IRowData>(
  options: IUseModelTableOptions<IModelInputState, IModelOutputState, IRowData>
): IUseModelTableResult<IRowData> => {
  const { modelState, modelRunToRow } = options;

  // useMemo is recommended by react-table docs.
  const data = useMemo(() =>
    // Table should display the most recent output state snapshot unless activeOutputSnapshotIdx is defined.
    modelState.modelRuns.map((run, idx) => {
      const index = idx === modelState.activeRunIdx && (modelState.activeOutputSnapshotIdx || modelState.activeOutputSnapshotIdx === 0)?
        modelState.activeOutputSnapshotIdx :
        run.outputStateSnapshots.length - 1;
      return modelRunToRow(run.inputState, run.outputStateSnapshots[index], run.isFinished);
    }
  ), [modelState.modelRuns, modelRunToRow, modelState.activeOutputSnapshotIdx, modelState.activeRunIdx]);

  const tableProps = {
    data,
    activeRow: modelState.activeRunIdx,
    onActiveRowChange: modelState.setActiveRunIdx,
    onRowDelete: modelState.removeModelRun,
    onClearTable: modelState.removeAllModelRuns,
  };

  return {
    tableProps
  };
};

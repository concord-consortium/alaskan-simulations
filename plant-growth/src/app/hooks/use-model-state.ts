import { useCallback, useMemo, useState } from "react";
import { defaultInitialState, IModelInputState, IModelOutputState } from "../../types";
import { useSaveInteractiveState } from "common/src/hooks/use-interactive-state";

// initialOutputState can be either an object or a function of initialInputState which returns an object.
export type OutputInitializerFunction<IModelInputState, T> = (inputState: IModelInputState) => T;
export type OutputInitializer<IModelInputState, T> = OutputInitializerFunction<IModelInputState, T> | T;

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (x: unknown): x is Function => typeof x === "function";

/*
 * IModelRun represents one simulation run done by user. It corresponds to one row in the data table (it's later
 * mapped to the table row data).
 */
export interface IModelRun<IModelInputState, IModelOutputState> {
  inputState: IModelInputState;
  outputStateSnapshots: IModelOutputState[];
  isFinished: boolean;
}

export interface IUseModelStateOptions<IModelInputState, IModelOutputState> {
  initialInputState: IModelInputState;
  initialOutputState: OutputInitializer<IModelInputState, IModelOutputState>;
  initialModelRuns: IModelRun<IModelInputState, IModelOutputState>[];
}

export interface IUseModelStateResult<IModelInputState, IModelOutputState> {
  // The current state of the model.
  modelRuns: IModelRun<IModelInputState, IModelOutputState>[];
  // The currently selected / active model run.
  activeRunIdx: number;
  setActiveRunIdx: (idx: number) => void;
  // The currently selected output snapshot. If it's equal to null, then the model isn't finished and snapshots are not available yet.
  activeOutputSnapshotIdx: number | null;
  setActiveOutputSnapshotIdx: (idx: number) => void;
  // The current input state of the model.
  inputState: IModelInputState;
  // The current output state of the model.
  outputState: IModelOutputState;
  // Flag that indicates whether the current run is finished.
  isFinished: boolean;
  setInputState: (update: Partial<IModelInputState>) => void;
  setOutputState: (update: Partial<IModelOutputState>) => void;
  // Saves the current output state in the snapshot array of the currently selected run.
  snapshotOutputState: (outputState: IModelOutputState) => void;
  addModelRun: () => void;
  removeModelRun: () => void;
  removeAllModelRuns: () => void;
  markRunFinished: () => void;
  isLastRunFinished: boolean;
}

/*
 * This hook is used to manage state of a model. Model state is represented by an array of model runs (IModelRun) that
 * is later mapped into data table rows. This array should always be the source of truth and we should avoid redundant
 * states if possible. The only exception is `currentOutputState` that is updated ~60 times per second when simulation
 * is running. It seems worth to keep it separate to avoid excessive re-renders of all the UI (like table and graph).
 * There are two additional states / concepts implemented here:
 *  - active run index
 *  - output snapshots and active output snapshot index
 * Active state index corresponds to the active row in the data table.
 * Output snapshots are used to let user go back and forth between states of the model after the simulation is finished.
 * Various helpers are provided to make it easier to work with these states.
 */
export const useModelState = (
  options: IUseModelStateOptions<IModelInputState, IModelOutputState>
): IUseModelStateResult<IModelInputState, IModelOutputState> => {
  const { initialInputState, initialOutputState, initialModelRuns } = options;
  const { saveInteractiveState } = useSaveInteractiveState();

  const initialOutputStateObject = useMemo(() =>
    isFunction(initialOutputState) ? initialOutputState(initialInputState) : initialOutputState
  , [initialInputState, initialOutputState]);

  const getNewModelRun = useCallback(() => ({
    inputState: defaultInitialState.inputState,
    outputStateSnapshots: [defaultInitialState.outputState],
    isFinished: false
  }), []);

  const [modelRuns, setModelRuns] = useState<IModelRun<IModelInputState, IModelOutputState>[]>(initialModelRuns.length > 0 ? initialModelRuns : [getNewModelRun()]);
  // currentOutputState is an optimization. It'd be possible to update outputState directly in the modelRuns
  // array, but this would mean that this whole array is updated 60 times per second when simulation is running.
  // This might not work great with table and graph rendering and it might generally slow down simulations.
  const [currentOutputState, setCurrentOutputState] = useState<IModelOutputState>(initialOutputStateObject);
  // activeRunIdx is a pointer to the currently active model run from the modelRuns array.
  const [activeRunIdx, setActiveRunIdx] = useState<number>(0);
  // activeOutputSnapshotIdx is a pointer to the currently active output snapshot run from the active model run.
  // It's used only when the model run is finished and user wants to go back and forth between various time steps.
  // When activeOutputSnapshotIdx is null, it means that currentOutputState is being used instead of snapshot
  // (when simulation is still running).
  const [activeOutputSnapshotIdx, setActiveOutputSnapshotIdx] = useState<number | null>(null);

  const setInputState = useCallback((update: Partial<IModelInputState>) => {
    // setInputState is operating directly on the modelRuns array. Input state is not updated frequently
    // compared to the output state, so this seems fine.

    setModelRuns(oldState => {
      if (oldState[activeRunIdx].isFinished) {
        // Don't let client update finished run.
        return oldState;
      }
      const newState = [...oldState];

      newState[activeRunIdx] = {
        ...newState[activeRunIdx],
        inputState: {...newState[activeRunIdx].inputState, ...update}
      };

      saveInteractiveState({inputState: {...newState[activeRunIdx].inputState}, modelRuns: newState});
      return newState;
    });
  }, [activeRunIdx, saveInteractiveState]);

  const setOutputState = useCallback((update: Partial<IModelOutputState>) => {
    setCurrentOutputState(oldState => {
      saveInteractiveState({outputState: {...oldState, ...update}});
      return {...oldState, ...update};
    });
  }, [saveInteractiveState]);

  const snapshotOutputState = useCallback((outputState: IModelOutputState) => {
    setModelRuns(oldState => {
      const newState = [...oldState];

      newState[activeRunIdx] = {
        ...newState[activeRunIdx],
        outputStateSnapshots: [...newState[activeRunIdx].outputStateSnapshots, outputState]
      };

      saveInteractiveState({
        inputState: {...newState[activeRunIdx].inputState},
        outputState,
        modelRuns: newState
      });

      return newState;
    });
  }, [activeRunIdx, saveInteractiveState]);

  const addModelRun = useCallback(() => {
    setCurrentOutputState(initialOutputStateObject);
    setActiveOutputSnapshotIdx(null);

    setModelRuns(oldState => {
      const newState = [...oldState, getNewModelRun()];
      saveInteractiveState({
        inputState: initialInputState,
        outputState: initialOutputStateObject,
        modelRuns: newState
      });
      return newState;
      }
    );

    setActiveRunIdx(modelRuns.length);
  }, [getNewModelRun, initialInputState, initialOutputStateObject, modelRuns.length, saveInteractiveState]);

  // This will remove all existing runs and and create a new one.
  const removeAllModelRuns = useCallback(() => {
    setCurrentOutputState(() => {
      saveInteractiveState({outputState: initialOutputStateObject});
      return initialOutputStateObject;
    });

    setActiveRunIdx(0);
    setActiveOutputSnapshotIdx(null);

    setModelRuns(() => {
      saveInteractiveState({modelRuns: [getNewModelRun()]});
      return [getNewModelRun()];
    });
  }, [getNewModelRun, initialOutputStateObject, saveInteractiveState]);

  const removeModelRun = useCallback(() => {
    if (modelRuns.length > 1) {
      const newActiveRunIdx = activeRunIdx > 0 ? activeRunIdx - 1 : activeRunIdx + 1;
      const newActiveRun = modelRuns[newActiveRunIdx];
      const snapshots = newActiveRun.outputStateSnapshots;

      setCurrentOutputState(() => {
        saveInteractiveState({outputState: snapshots[snapshots.length - 1]});
        return snapshots[snapshots.length - 1];
      });

      setActiveOutputSnapshotIdx(newActiveRun.isFinished ? snapshots.length - 1 : null);

      if (activeRunIdx > 0) {
        setActiveRunIdx(activeRunIdx - 1);
      }

      setModelRuns(oldState => {
        const newState = [...oldState];
        newState.splice(activeRunIdx, 1);
        saveInteractiveState({modelRuns: newState});
        return newState;
      });
    } else {
      // When there's only one run left, it's going to be removed and a new, fresh one will be created.
      removeAllModelRuns();
    }
  }, [activeRunIdx, modelRuns, removeAllModelRuns, saveInteractiveState]);

  const handleSetActiveRunIdx = useCallback((idx: number) => {
    if (!modelRuns[idx]) {
      console.warn(`Trying to set active run index to ${idx}, but it's out of range.`);
      return;
    }
    setActiveRunIdx(idx);
    const run = modelRuns[idx];
    const snapshots = run.outputStateSnapshots;

    setCurrentOutputState(() => {
      saveInteractiveState({outputState: snapshots[snapshots.length - 1]});
      return snapshots[snapshots.length - 1];
    });

    setActiveOutputSnapshotIdx(run.isFinished ? snapshots.length - 1 : null);
  }, [modelRuns, saveInteractiveState]);

  const handleSetActiveOutputSnapshotIdx = useCallback((idx: number) => {
    const snapshots = modelRuns[activeRunIdx].outputStateSnapshots;

    if (!snapshots[idx]) {
      console.warn(`Trying to set active output snapshot index to ${idx}, but it's out of range.`);
      return;
    }

    setCurrentOutputState(() => {
      saveInteractiveState({outputState: snapshots[idx]});
      return snapshots[idx];
    });

    setActiveOutputSnapshotIdx(idx);
  }, [activeRunIdx, modelRuns, saveInteractiveState]);

  const markRunFinished = useCallback(() => {
    setModelRuns((oldState)=> {
      const newState = [...oldState.map((run) => { return {...run};})];
      newState[activeRunIdx].isFinished = true;

      saveInteractiveState({
        inputState: {...newState[activeRunIdx].inputState},
        outputState: currentOutputState,
        modelRuns: newState
      });

      return newState;
    });
  }, [activeRunIdx, saveInteractiveState, currentOutputState]);

  return {
    activeRunIdx,
    setActiveRunIdx: handleSetActiveRunIdx,
    activeOutputSnapshotIdx,
    setActiveOutputSnapshotIdx: handleSetActiveOutputSnapshotIdx,
    inputState: modelRuns[activeRunIdx].inputState,
    outputState: currentOutputState,
    isFinished: modelRuns[activeRunIdx].isFinished,
    setInputState,
    setOutputState,
    markRunFinished,
    snapshotOutputState,
    modelRuns,
    addModelRun,
    removeModelRun,
    removeAllModelRuns,
    isLastRunFinished: modelRuns[modelRuns.length - 1].isFinished
  };
};

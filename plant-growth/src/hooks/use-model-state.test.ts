import { act, renderHook } from "@testing-library/react-hooks";
import { defaultAuthoredState, InputAmount, OutputAmountValue } from "../types";
import { useModelState } from "./use-model-state";

const testState = {
  inputState: defaultAuthoredState,
  outputState: {
    time: 0,
    sugarUsed: OutputAmountValue.None,
    sugarCreated: OutputAmountValue.None
  },
  modelRuns: [],
};

const fullLight = {
  light: InputAmount.Full,
  water: InputAmount.Some,
  co2amount: InputAmount.Some,
};

const noLight = {
  light: InputAmount.None,
  water: InputAmount.Some,
  co2amount: InputAmount.Some,
};

const newOutput1 = {
  time: 0,
  sugarCreated: OutputAmountValue.None,
  sugarUsed: OutputAmountValue.None
};

const newOutput2 = {
  time: 0,
  sugarCreated: OutputAmountValue.Medium,
  sugarUsed: OutputAmountValue.None
};

describe("useModelState", () => {
  it("returns correct state values", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: testState.modelRuns
    });
    const { result } = renderHook(HookWrapper);

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState,
        outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null);
    expect(result.current.inputState).toEqual(testState.inputState);
    expect(result.current.outputState).toEqual(testState.outputState);
    expect(result.current.isFinished).toBe(false);
  });

  it("lets client update inputState", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: testState.modelRuns
    });
    const { result } = renderHook(HookWrapper);

    expect(result.current.inputState).toEqual(testState.inputState);
    act(() => {
      result.current.setInputState({ light: InputAmount.Full });
    });
    expect(result.current.inputState).toEqual(fullLight);
    expect(result.current.modelRuns).toEqual([
      { inputState: fullLight, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
  });

  it("lets client update outputState", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: testState.modelRuns
    });
    const { result } = renderHook(HookWrapper);

    expect(result.current.outputState).toEqual(testState.outputState);
    act(() => {
      result.current.setOutputState({sugarCreated: OutputAmountValue.None});
    });
    expect(result.current.outputState).toEqual(newOutput1);
    expect(result.current.modelRuns).toEqual([
      // Note that the initial snapshot is NOT updated!
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
  });

  it("lets client mark run as finished", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.markRunFinished();
    });

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: true },
    ]);
  });

  it("doesn't let client update input state of the  finished run", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.markRunFinished();
    });

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: true },
    ]);

    act(() => {
      result.current.setInputState({
        light: InputAmount.Full,
      });
    });

    expect(result.current.modelRuns).toEqual([
      // expect LightInputAmount.Some instead of LightInputAmount.Full
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: true },
    ]);
  });

  it("lets client add new model run", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.setOutputState({sugarCreated: OutputAmountValue.None});
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.outputState).toEqual(newOutput1);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);

    act(() => {
      result.current.addModelRun();
    });
    expect(result.current.activeRunIdx).toBe(1);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
  });

  it("lets client remove model runs", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.addModelRun();
    });
    act(() => {
      result.current.setInputState({light: InputAmount.Full});
    });
    act(() => {
      result.current.setOutputState({sugarCreated: OutputAmountValue.None});
    });
    expect(result.current.activeRunIdx).toBe(1);
    expect(result.current.outputState).toEqual(newOutput1);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
      { inputState: fullLight, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);

    // Remove the last run (currently active).
    act(() => {
      result.current.removeModelRun();
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);

    // Add run again, switch to run 0, and then remove it (the first run).
    act(() => {
      result.current.addModelRun();
    });
    act(() => {
      result.current.setInputState({light: InputAmount.None});
      result.current.snapshotOutputState(newOutput1);
      result.current.markRunFinished();
    });
    act(() => {
      result.current.setActiveRunIdx(0);
    });
    act(() => {
      result.current.setOutputState({sugarCreated: OutputAmountValue.Medium});
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.outputState).toEqual(newOutput2);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
      { inputState: noLight, outputStateSnapshots: [testState.outputState, newOutput1], isFinished: true },
    ]);

    act(() => {
      result.current.removeModelRun();
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(1); // run is finished, last snapshot was loaded
    expect(result.current.outputState).toEqual(newOutput1);
    expect(result.current.modelRuns).toEqual([
      { inputState: noLight, outputStateSnapshots: [testState.outputState, newOutput1], isFinished: true },
    ]);

    // Finally, try to remove the last run. It should just reset it to default input and output state.
    act(() => {
      result.current.removeModelRun();
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
  });

  it("lets client remove all model runs", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);
    expect(result.current.activeRunIdx).toBe(0);
    act(() => {
      result.current.addModelRun();
    });
    act(() => {
      result.current.addModelRun();
    });
    act(() => {
      result.current.setInputState({light: InputAmount.Full});
    });
    expect(result.current.activeRunIdx).toBe(2);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
      { inputState: fullLight, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);

    act(() => {
      result.current.removeAllModelRuns();
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false }
    ]);
  });

  it("lets client snapshot output state", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState], isFinished: false },
    ]);

    act(() => {
      result.current.snapshotOutputState(newOutput1);
    });
    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState, newOutput1], isFinished: false },
    ]);

    // Now let's update add a new run and test if snapshot will be added to it.
    act(() => {
      result.current.addModelRun();
    });

    act(() => {
      result.current.snapshotOutputState(newOutput2);
    });

    expect(result.current.modelRuns).toEqual([
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState, newOutput1], isFinished: false },
      { inputState: testState.inputState, outputStateSnapshots: [testState.outputState, newOutput2], isFinished: false }
    ]);
  });

  it("lets client navigate between model runs", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.addModelRun();
    });
    act(() => {
      result.current.snapshotOutputState(newOutput1);
      result.current.markRunFinished();
    });

    act(() => {
      result.current.setActiveRunIdx(1);
    });
    expect(result.current.activeRunIdx).toBe(1);
    expect(result.current.activeOutputSnapshotIdx).toBe(1);  // run is finished
    expect(result.current.outputState).toEqual(newOutput1); // last snapshot is used

    act(() => {
      result.current.setActiveRunIdx(0);
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);

    // Invalid index is ignored.
    act(() => {
      result.current.setActiveRunIdx(999);
    });
    expect(result.current.activeRunIdx).toBe(0);
    expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
    expect(result.current.outputState).toEqual(testState.outputState);
  });

  it("lets client navigate between output state snapshots", () => {
    const HookWrapper = () => useModelState({
      initialInputState: testState.inputState,
      initialOutputState: testState.outputState,
      initialModelRuns: []
    });
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.snapshotOutputState(newOutput1);
      result.current.snapshotOutputState(newOutput2);
    });

    expect(result.current.outputState).toEqual(testState.outputState);

    act(() => {
      result.current.setActiveOutputSnapshotIdx(1);
    });
    expect(result.current.activeOutputSnapshotIdx).toBe(1);
    expect(result.current.outputState).toEqual(newOutput1);

    act(() => {
      result.current.setActiveOutputSnapshotIdx(2);
    });
    expect(result.current.activeOutputSnapshotIdx).toBe(2);
    expect(result.current.outputState).toEqual(newOutput2);

    // Invalid index is ignored.
    act(() => {
      result.current.setActiveOutputSnapshotIdx(999);
    });
    expect(result.current.activeOutputSnapshotIdx).toBe(2);
    expect(result.current.outputState).toEqual(newOutput2);
  });
});

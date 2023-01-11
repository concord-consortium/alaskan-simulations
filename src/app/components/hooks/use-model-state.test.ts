// import { act, renderHook } from "@testing-library/react-hooks";
// import { useModelState } from "./use-model-state";

// interface ITestInputState {
//   foo: number;
// }

// interface ITestOutputState {
//   bar: number;
// }

// describe("useModelState", () => {
//   it("returns correct state values", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null);
//     expect(result.current.inputState).toEqual({ foo: 0 });
//     expect(result.current.outputState).toEqual({ bar: 1 });
//     expect(result.current.isFinished).toBe(false);
//   });

//   it("lets client initialize outputState using a function", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: (inputState) => ({ bar: inputState.foo + 1 }),
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//     expect(result.current.outputState).toEqual({ bar: 1 });
//   });

//   it("lets client update inputState", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.inputState).toEqual({ foo: 0 });
//     act(() => {
//       result.current.setInputState({ foo: 1 });
//     });
//     expect(result.current.inputState).toEqual({ foo: 1 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 1 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//   });

//   it("lets client update outputState", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.outputState).toEqual({ bar: 1 });
//     act(() => {
//       result.current.setOutputState({ bar: 2 });
//     });
//     expect(result.current.outputState).toEqual({ bar: 2 });
//     expect(result.current.modelRuns).toEqual([
//       // Note that the initial snapshot is NOT updated!
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//   });

//   it("lets client mark run as finished", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.markRunFinished();
//     });

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: true },
//     ]);
//   });

//   it("doesn't let client update input state of the  finished run", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.markRunFinished();
//     });

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: true },
//     ]);

//     act(() => {
//       result.current.setInputState({ foo: 123 });
//     });

//     expect(result.current.modelRuns).toEqual([
//       // expect foo: 0 instead of foo: 123
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: true },
//     ]);
//   });

//   it("lets client add new model run", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.setOutputState({ bar: 2 });
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.outputState).toEqual({ bar: 2 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);

//     act(() => {
//       result.current.addModelRun();
//     });
//     expect(result.current.activeRunIdx).toBe(1);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({ bar: 1 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//   });

//   it("lets client remove model runs", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.setInputState({ foo: 1 });
//     });
//     act(() => {
//       result.current.setOutputState({ bar: 2 });
//     });
//     expect(result.current.activeRunIdx).toBe(1);
//     expect(result.current.outputState).toEqual({ bar: 2 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//       { inputState: { foo: 1 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);

//     // Remove the last run (currently active).
//     act(() => {
//       result.current.removeModelRun();
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({ bar: 1 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);

//     // Add run again, switch to run 0, and then remove it (the first run).
//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.setInputState({ foo: 1 });
//       result.current.snapshotOutputState({ bar: 20 });
//       result.current.markRunFinished();
//     });
//     act(() => {
//       result.current.setActiveRunIdx(0);
//     });
//     act(() => {
//       result.current.setOutputState({ bar: 2 });
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.outputState).toEqual({ bar: 2 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//       { inputState: { foo: 1 }, outputStateSnapshots: [{ bar: 1 }, { bar: 20 }], isFinished: true },
//     ]);

//     act(() => {
//       result.current.removeModelRun();
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(1); // run is finished, last snapshot was loaded
//     expect(result.current.outputState).toEqual({ bar: 20 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 1 }, outputStateSnapshots: [{ bar: 1 }, { bar: 20 }], isFinished: true },
//     ]);

//     // Finally, try to remove the last run. It should just reset it to default input and output state.
//     act(() => {
//       result.current.removeModelRun();
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({ bar: 1 });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//   });

//   it("lets client remove all model runs", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//     expect(result.current.activeRunIdx).toBe(0);
//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.setInputState({ foo: 1 });
//     });
//     expect(result.current.activeRunIdx).toBe(2);
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//       { inputState: { foo: 1 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);

//     act(() => {
//       result.current.removeAllModelRuns();
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({bar: 1});
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false }
//     ]);
//   });

//   it("lets client snapshot output state", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }], isFinished: false },
//     ]);
//     act(() => {
//       result.current.snapshotOutputState({ bar: 2 });
//     });
//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }, {bar: 2}], isFinished: false },
//     ]);

//     // Now let's update add a new run and test if snapshot will be added to it.
//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.snapshotOutputState({ bar: 3 });
//     });

//     expect(result.current.modelRuns).toEqual([
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }, {bar: 2}], isFinished: false },
//       { inputState: { foo: 0 }, outputStateSnapshots: [{ bar: 1 }, {bar: 3}], isFinished: false }
//     ]);
//   });

//   it("lets client navigate between model runs", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.addModelRun();
//     });
//     act(() => {
//       result.current.snapshotOutputState({ bar: 2 });
//       result.current.markRunFinished();
//     });

//     act(() => {
//       result.current.setActiveRunIdx(1);
//     });
//     expect(result.current.activeRunIdx).toBe(1);
//     expect(result.current.activeOutputSnapshotIdx).toBe(1);  // run is finished
//     expect(result.current.outputState).toEqual({ bar: 2 }); // last snapshot is used

//     act(() => {
//       result.current.setActiveRunIdx(0);
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({ bar: 1 });

//     // Invalid index is ignored.
//     act(() => {
//       result.current.setActiveRunIdx(999);
//     });
//     expect(result.current.activeRunIdx).toBe(0);
//     expect(result.current.activeOutputSnapshotIdx).toBe(null); // run is not finished
//     expect(result.current.outputState).toEqual({ bar: 1 });
//   });

//   it("lets client navigate between output state snapshots", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: { bar: 1 },
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     act(() => {
//       result.current.snapshotOutputState({ bar: 2 });
//       result.current.snapshotOutputState({ bar: 3 });
//     });

//     expect(result.current.outputState).toEqual({ bar: 1 });

//     act(() => {
//       result.current.setActiveOutputSnapshotIdx(1);
//     });
//     expect(result.current.activeOutputSnapshotIdx).toBe(1);
//     expect(result.current.outputState).toEqual({ bar: 2 });

//     act(() => {
//       result.current.setActiveOutputSnapshotIdx(2);
//     });
//     expect(result.current.activeOutputSnapshotIdx).toBe(2);
//     expect(result.current.outputState).toEqual({ bar: 3 });

//     // Invalid index is ignored.
//     act(() => {
//       result.current.setActiveOutputSnapshotIdx(999);
//     });
//     expect(result.current.activeOutputSnapshotIdx).toBe(2);
//     expect(result.current.outputState).toEqual({ bar: 3 });
//   });

//   it("ensures that initial output state is stable when output state initializer function is used", () => {
//     const HookWrapper = () => useModelState<ITestInputState, ITestOutputState>({
//       initialInputState: { foo: 0 },
//       initialOutputState: (inputState) => ({ bar: inputState.foo + Math.random() }),
//       initialModelRuns: []
//     });
//     const { result } = renderHook(HookWrapper);

//     expect(result.current.outputState).toEqual(result.current.modelRuns[0].outputStateSnapshots[0]);
//   });
// });

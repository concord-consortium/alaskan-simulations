import { act, renderHook } from "@testing-library/react-hooks";
import { EQualitativeAmount, defaultAuthoredState } from "../types";
import { useModelState } from "./use-model-state";

const testState = {
  inputState: defaultAuthoredState,
  outputState: {
    time: 0,
    algaeEndLevel: EQualitativeAmount.medium,
    nitrate: EQualitativeAmount.low,
    turbidity: EQualitativeAmount.low
  },
  modelRuns: [],
};

describe("useModelState", () => {
  it("should load the initial state", () => {
    console.log("testState", testState);
    // const { result } = renderHook(() => useModelState());
    // expect(result.current.inputState).toEqual(defaultAuthoredState);
    // expect(result.current.modelRuns).toEqual([]);
  });
});

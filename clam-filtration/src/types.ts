import { IRuntimeInteractiveMetadata } from "@concord-consortium/lara-interactive-api";
import { IModelRun } from "./hooks/use-model-state";

export interface IAuthoredState extends IModelInputState {}
export interface IInteractiveState extends IRuntimeInteractiveMetadata {
  inputState: IModelInputState,
  outputState: IModelOutputState,
  modelRuns: IModelRun<IModelInputState, IModelOutputState>[],
  readAloudMode: boolean
}

export enum EQualitativeAmount {
  low = "AMOUNT.LOW",
  medium = "AMOUNT.MEDIUM",
  high = "AMOUNT.HIGH"
}

export interface IModelInputState {
  algaeStart: EQualitativeAmount;
  numClams: number;
}

export interface IModelOutputState {
  time: number;
  algaeEnd: EQualitativeAmount;
  nitrate: EQualitativeAmount;
  turbidity: EQualitativeAmount;
}

export interface IRowData {
  numClams: number;
  algaeEnd: EQualitativeAmount;
  nitrate: EQualitativeAmount;
  turbidity: EQualitativeAmount;
}

export const defaultAuthoredState: IAuthoredState = {
  algaeStart: EQualitativeAmount.medium,
  numClams: 5
};

export const defaultInitialState: IInteractiveState = {
    answerType: "interactive_state",
    inputState: defaultAuthoredState,
    outputState: {
      time: 0,
      algaeEnd: EQualitativeAmount.low,
      nitrate: EQualitativeAmount.low,
      turbidity: EQualitativeAmount.low
    },
    modelRuns: [],
    readAloudMode: false
  };

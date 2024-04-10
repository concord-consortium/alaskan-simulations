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
  algaeEnd: EQualitativeAmount | null;
  nitrate: EQualitativeAmount | null;
  turbidity: EQualitativeAmount | null;
}

export interface IRowData {
  numClams: number;
  algaeEnd: EQualitativeAmount | null;
  nitrate: EQualitativeAmount | null;
  turbidity: EQualitativeAmount | null;
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
      algaeEnd: null,
      nitrate: null,
      turbidity: null
    },
    modelRuns: [],
    readAloudMode: false
  };

import { IRuntimeInteractiveMetadata } from "@concord-consortium/lara-interactive-api";
import { IModelRun } from "./hooks/use-model-state";

export interface IAuthoredState extends IModelInputState {}
export interface IInteractiveState extends IRuntimeInteractiveMetadata {
  inputState: IModelInputState,
  outputState: IModelOutputState,
  modelRuns: IModelRun<IModelInputState, IModelOutputState>[],
  readAloudMode: boolean
}

export enum Amount {
  High = 2,
  Medium = 1,
  Low = 0
}

export const amountLabels: Record<Amount, string> = {
  [Amount.High]: "AMOUNT.HIGH",
  [Amount.Medium]: "AMOUNT.MEDIUM",
  [Amount.Low]: "AMOUNT.LOW"
};

export const clamLabels: Record<number, string> = {
  [Amount.High]: "AMOUNT.10",
  [Amount.Medium]: "AMOUNT.5",
  [Amount.Low]: "AMOUNT.1"
};

export interface IModelInputState {
  algaeStart: Amount;
  numClams: Amount;
}

export interface IModelOutputState {
  time: number;
  algaeEnd: Amount;
  nitrate: Amount;
  turbidity: Amount;
}

export interface IRowData {
  numClams: string | JSX.Element;
  algaeEnd: string | JSX.Element;
  nitrate: string | JSX.Element;
  turbidity: string | JSX.Element;
}

export const defaultAuthoredState: IAuthoredState = {
  algaeStart: Amount.Medium,
  numClams: Amount.Medium
};

export const defaultInitialState: IInteractiveState = {
    answerType: "interactive_state",
    inputState: defaultAuthoredState,
    outputState: {
      time: 0,
      algaeEnd: 0,
      nitrate: 0,
      turbidity: 0
    },
    modelRuns: [],
    readAloudMode: false
  };

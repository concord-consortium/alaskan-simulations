import { IRuntimeInteractiveMetadata } from "@concord-consortium/lara-interactive-api";
import { IModelRun } from "./app/hooks/use-model-state";

export interface IAuthoredState extends IModelInputState {}
export interface IInteractiveState extends IRuntimeInteractiveMetadata {
  inputState: IModelInputState,
  outputState: IModelOutputState,
  modelRuns: IModelRun<IModelInputState, IModelOutputState>[],
  readAloudMode: boolean
}

export enum RulerType {
  Metric = "cm",
  Imperial = "in"
}

export enum Container {
  Glass = "CONTAINER.GLASS",
  Mesh = "CONTAINER.MESH"
}

export enum InputAmount {
  None = "AMOUNT.NONE",
  Some = "AMOUNT.SOME",
  Full = "AMOUNT.FULL"
}

export enum OutputAmountValue {
  None = 0,
  Low = 1,
  Medium = 4,
  High = 8
}

export enum OutputAmount {
  None = "OUTPUT.NONE",
  Low = "OUTPUT.LOW",
  Medium = "OUTPUT.MEDIUM",
  High = "OUTPUT.HIGH",
}

export interface IModelInputState {
  light: InputAmount;
  water: InputAmount;
  co2amount: InputAmount;
}

export interface IModelOutputState {
  time: number;
  sugarUsed: number;
  sugarCreated: number;
}

export interface IRowData {
  light: JSX.Element;
  water: JSX.Element;
  co2: JSX.Element;
  sugarUsed: string | JSX.Element;
  sugarCreated: string | JSX.Element;
}

export const defaultAuthoredState: IAuthoredState = {
  light: InputAmount.Some,
  water: InputAmount.Some,
  co2amount: InputAmount.Some,
};

export const defaultInitialState: IInteractiveState = {
    answerType: "interactive_state",
    inputState: defaultAuthoredState,
    outputState: {
      time: 0,
      sugarUsed: 0,
      sugarCreated: 0
    },
    modelRuns: [],
    readAloudMode: false
  };

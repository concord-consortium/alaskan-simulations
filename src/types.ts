import { IRuntimeInteractiveMetadata } from "@concord-consortium/lara-interactive-api";
import { IModelRun } from "./app/components/hooks/use-model-state";

export interface IAuthoredState extends IModelInputState {}
export interface IInteractiveState extends IRuntimeInteractiveMetadata {
  inputState?: IModelInputState | undefined,
  outputState?: IModelOutputState,
  modelRuns?: IModelRun<IModelInputState, IModelOutputState>[] | undefined,
  activeRun?: number
}

export enum Container {
  Glass = "CONTAINER.GLASS",
  Mesh = "CONTAINER.MESH"
}

export enum LightAmount {
  None = "LIGHT_AMOUNT.NONE",
  Some = "LIGHT_AMOUNT.SOME",
  Full = "LIGHT_AMOUNT.FULL"
}


export enum WaterAmount {
  None = "WATER_AMOUNT.NONE",
  Some = "WATER_AMOUNT.SOME",
  Full = "WATER_AMOUNT.FULL"
}

export enum CO2Amount {
  None = "CO2_AMOUNT.NONE",
  Some = "CO2_AMOUNT.SOME",
  Full = "CO2_AMOUNT.FULL"
}

export interface IPlantChange {
  change: number|string;
  leavesChange: number;
}

export interface IModelInputState {
  light: LightAmount;
  water: WaterAmount;
  co2amount: CO2Amount;
}

export interface IModelOutputState {
  time: number;
  lightChange: number | string;
  waterMassChange: number | string;
  co2Change: number | string;
  plantChange: IPlantChange;
}

export interface IRowData {
  startingConditions: JSX.Element;
  lightChange: number | string; // for now
  waterMassChange: number | string; // for now
  co2Change: number | string; // for now
  plantChange: IPlantChange; // for now
}

export const defaultAuthoredState: IAuthoredState = {
  light: LightAmount.Some,
  water: WaterAmount.Some,
  co2amount: CO2Amount.None,
};

export const defaultInitialState: Partial<IInteractiveState> = {
    inputState: defaultAuthoredState,
    outputState: {
      time: 0,
      lightChange: "--",
      waterMassChange: "--",
      co2Change: "--",
      plantChange: {
        change: 0,
        leavesChange: 0
      }
    },
    modelRuns: [],
};

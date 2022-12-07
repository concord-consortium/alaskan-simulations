export interface IAuthoredState {}
export interface IInteractiveState {}

export enum Container {
  Glass = "CONTAINER.GLASS",
  Mesh = "CONTAINER.MESH"
}

export enum CO2Amount {
  None = "CO2_AMOUNT.NONE",
  No = "CO2_AMOUNT.NO",
  Low = "CO2_AMOUNT.LOW",
  Normal = "CO2_AMOUNT.NORMAL"
}

export interface IPlantChange {
  change: number|string;
  leavesChange: number;
}

export interface IModelInputState {
  soil: boolean;
  water: boolean;
  co2amount: CO2Amount;
}

export interface IModelOutputState {
  time: number;
  soilChange: number | string;
  waterMassChange: number | string;
  co2Change: number | string;
  plantChange: IPlantChange;
}

export interface IRowData {
  startingConditions: JSX.Element;
  soilChange: number | string; // for now
  waterMassChange: number | string; // for now
  co2Change: number | string; // for now
  plantChange: IPlantChange; // for now
}

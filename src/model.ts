import { t } from "./common";
import { CO2Amount, IModelInputState, IPlantChange } from "./types";

const DOUBLE_DASH = "--";

export class Model {
  public time = 0;
  public soilChange: number | string;
  public waterMassChange: number | string;
  public co2Change: number | string;
  public plantChange: IPlantChange = {
    change: 0,
    leavesChange: 0
  };
  private inputs: IModelInputState;

  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
    this.soilChange = this.getSoilChange(inputs, 0);
    this.waterMassChange = this.getMassWaterChange(inputs, 0);
    this.co2Change = this.getCO2Change(inputs, 0);
    this.plantChange = this.getPlantChange(inputs, 0);
  }

  public step(dt: number) {
    this.time = Math.min(1, this.time + dt);
    this.changeProperties();
  }

  public changeProperties(){
    const index = Math.floor(this.time * 8);
    this.soilChange = this.getSoilChange(this.inputs, index);
    this.waterMassChange = this.getMassWaterChange(this.inputs, index);
    this.co2Change = this.getCO2Change(this.inputs, index);
    this.plantChange = this.getPlantChange(this.inputs, index);
  }

  private getSoilChange(inputs: IModelInputState, index: number) {
    if (!inputs.soil) {
      return DOUBLE_DASH;
    }
    return this.getZeroOrNoChange(index);
  }

  private getMassWaterChange(inputs: IModelInputState, index: number) {
    if (!inputs.water) {
      return DOUBLE_DASH;
    }
    if (inputs.co2amount === CO2Amount.No) {
      return this.getZeroOrNoChange(index);
    }
    if (inputs.co2amount === CO2Amount.Low) {
      return this.getSlowChange(index);
    }
    return this.getFastChange(index);
  }

  private getCO2Change(inputs: IModelInputState, index: number) {
    if (inputs.co2amount === CO2Amount.No) {
      return DOUBLE_DASH;
    }
    if (!inputs.water) {
      return this.getZeroOrNoChange(index);
    }
    if (inputs.co2amount === CO2Amount.Low) {
      return this.getSlowChange(index);
    }
    return this.getFastChange(index);
  }

  private getPlantChange(inputs: IModelInputState, index: number) {
    const zeroOrNoChange = this.getZeroOrNoChange(index);

    if (!inputs.water) {
      return [
        {change: zeroOrNoChange, leavesChange: 5},
        {change: zeroOrNoChange, leavesChange: 5},
        {change: zeroOrNoChange, leavesChange: 5},
        {change: zeroOrNoChange, leavesChange: 5},
        {change: zeroOrNoChange, leavesChange: 5},
        {change: -1, leavesChange: 4},
        {change: -1, leavesChange: 4},
        {change: -2, leavesChange: 3},
      ][index];
    }

    if (inputs.co2amount === CO2Amount.No) {
      return [
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
        {change: zeroOrNoChange, leavesChange: 0},
      ][index];
    }

    if (inputs.co2amount === CO2Amount.Low) {
      return [
        {change: zeroOrNoChange, leavesChange: 5},
        {change: zeroOrNoChange, leavesChange: 5},
        {change: 1, leavesChange: 6},
        {change: 1, leavesChange: 6},
        {change: 2, leavesChange: 7},
        {change: 2, leavesChange: 7},
        {change: 2, leavesChange: 7},
        {change: 2, leavesChange: 7},
      ][index];
    }

    return [
      {change: zeroOrNoChange, leavesChange: 5},
      {change: zeroOrNoChange, leavesChange: 5},
      {change: 1, leavesChange: 6},
      {change: 1, leavesChange: 6},
      {change: 2, leavesChange: 7},
      {change: 2, leavesChange: 7},
      {change: 3, leavesChange: 8},
      {change: 4, leavesChange: 9},
    ][index];
  }

  private getZeroOrNoChange(index: number) {
    return index === 0 ? 0 : t("LABEL.NO_CHANGE");
  }

  private getSlowChange(index: number) {
    return [0, -0.5, -0.5, -1, -1, -1, -1, -1][index];
  }

  private getFastChange(index: number) {
    return [0, -0.5, -0.5, -1, -1, -1.5, -1.5, -2][index];
  }
}

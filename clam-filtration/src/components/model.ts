import { IModelInputState, TOutput, algaeStr, amountToAlgaeKey, amountToClamKey, nitrateStr, turbidityStr } from "../types";
import { outputData } from "../utils/data";

export const kMaxSteps = 8;

export class Model {
  public time = 0;
  public algae: number;
  public nitrate: number;
  public turbidity: number;
  private inputs: IModelInputState;
  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
    this.algae = 0;
    this.nitrate = 0;
    this.turbidity = 0;
  }

  public step() {
    if (this.time > kMaxSteps) return;
    this.time = this.time + 1/60;
    this.changeProperties();
  }

  public changeProperties(){
    const segments = 4;
    const durationPerSegment = 8 / segments;
    const monthIndex = Math.floor(this.time / durationPerSegment + .0001);
    this.algae = this.getOutputAmount(this.inputs, monthIndex, algaeStr);
    this.nitrate = this.getOutputAmount(this.inputs, monthIndex, nitrateStr);
    this.turbidity = this.getOutputAmount(this.inputs, monthIndex, turbidityStr);
  }

  private getOutputAmount(inputs: IModelInputState, index: number, type: TOutput) {
    const months = ["May", "June", "July", "August", "September"];
    const month = months[index];
    const {algaeStart, numClams} = inputs;
    const key = `${amountToAlgaeKey[algaeStart]}${amountToClamKey[numClams]}`;
    const dataForMonth = outputData[key].find(data => data.month === month);
    return dataForMonth?.output[type] || 0;
  }

  public getSimulationState() {
    const percentComplete =  this.time / kMaxSteps;
    const isFinished = this.time >= kMaxSteps;
    const {algae, nitrate, turbidity} = this;
    return {
      percentComplete,
      isFinished,
      algae,
      nitrate,
      turbidity
    };
  }
}

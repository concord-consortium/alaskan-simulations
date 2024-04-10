import { EQualitativeAmount, IModelInputState } from "../types";
import equal from "deep-equal";

interface ICaseData {
  inputs: IModelInputState,
  inputs2?: IModelInputState,
}

// There are 27 cases total documented in the NAM/ANEP Plant Food-O-Meter spreadsheet.
// No light cases with the same outcomes: cases 1, 4, 10, 13, 19, 20.
// No water cases with the same outcomes: cases 7, 8, 9, 16, 17, 18, 25, 26, 27.
// No co2 cases with the same outcomes: cases 21, 22, 23, 24.

const case2: ICaseData = {
  inputs: {
    algaeStart: EQualitativeAmount.medium,
    numClams: 5,
  }
};

export class Model {
  public time = 0;
  public sugarUsed: number;
  public sugarCreated: number;
  private inputs: IModelInputState;

  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
    this.sugarUsed = 0;
    this.sugarCreated = 0;
  }

  public step(dt: number) {
    this.time = Math.min(1, this.time + dt);
    this.changeProperties();
  }

  public changeProperties(){
    const index = Math.floor(this.time * 8);
  }

  private getOutputAmount(inputs: IModelInputState, index: number) {
    const {algaeStart, numClams} = inputs;
    const algaeEnd = EQualitativeAmount.high;
    const nitrate = EQualitativeAmount.high;
    const turbidity = EQualitativeAmount.high;
  }
}

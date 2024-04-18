import { Amount, IModelInputState } from "../types";

interface ICaseData {
  inputs: IModelInputState,
}

// There are 9 cases total documented

const case1: ICaseData = {
  inputs: {
    algaeStart: Amount.Low,
    numClams: 1,
  }
};

export class Model {
  public time = 0;
  private inputs: IModelInputState;

  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
  }

  public step(dt: number) {
    this.time = Math.min(1, this.time + dt);
    this.changeProperties();
  }

  public changeProperties(){
    const index = Math.floor(this.time * 8);
  }

  private getOutputAmount(inputs: IModelInputState, index: number) {
    // TODO need to return the correct output amounts here
    const {algaeStart, numClams} = inputs;
    const algaeEnd = Amount.High;
    const nitrate = Amount.High;
    const turbidity = Amount.High;
  }
}

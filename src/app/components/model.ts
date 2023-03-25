import { IModelInputState } from "../../types";

export class Model {
  public time = 0;
  public sugarUsed: number|string;
  public sugarCreated: number|string;
  private inputs: IModelInputState;

  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
    this.sugarUsed = "";
    this.sugarCreated = "";
  }

  public step(dt: number) {
    this.time = Math.min(1, this.time + dt);
    this.changeProperties();
  }

  public changeProperties(){
    const index = Math.floor(this.time * 8);
    this.sugarUsed = this.getSugarUsed(this.inputs, index);
    this.sugarCreated = this.getSugarCreated(this.inputs, index);
  }

  private getSugarUsed(inputs: IModelInputState, index: number) {
    return "";
  }

  private getSugarCreated(inputs: IModelInputState, index: number) {
    return "";
  }
}

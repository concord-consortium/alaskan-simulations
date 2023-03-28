import { IModelInputState, InputAmount } from "../../types";
import equal from "deep-equal";

interface ICaseData {
  inputs: IModelInputState,
  inputs2?: IModelInputState,
  sugarUsed: Array<number>,
  sugarCreated: Array<number>
}

// There are 27 cases total documented in the NAM/ANEP Plant Food-O-Meter spreadsheet.
// No light cases with the same outcomes: cases 1, 4, 10, 13, 19, 20.
// No water cases with the same outcomes: cases 7, 8, 9, 16, 17, 18, 25, 26, 27.
// No co2 cases with the same outcomes: cases 21, 22, 23, 24.

const case2: ICaseData = {
  inputs: {
    light: InputAmount.Some,
    water: InputAmount.Full,
    co2amount: InputAmount.Full,
  },
  // case 6 has the exact same output as case 2
  inputs2: {
    light: InputAmount.Full,
    water: InputAmount.Some,
    co2amount: InputAmount.Full,
  },
  sugarUsed: [0, 0.8, 0.9, 1, 1, 1, 1, 1],
  sugarCreated: [0, 2.2, 2.3, 2.4, 2.5, 2.5, 2.5, 2.5]
};

const case3: ICaseData = {
  inputs: {
    light: InputAmount.Full,
    water: InputAmount.Full,
    co2amount: InputAmount.Full,
  },
  sugarUsed: [0, 1.3, 1.8, 2.1, 2.4, 2.8, 3.4, 4],
  sugarCreated: [0, 3, 4.8, 5, 5.8, 7, 7.8, 10]
};

const case5: ICaseData = {
  inputs: {
    light: InputAmount.Some,
    water: InputAmount.Some,
    co2amount: InputAmount.Full,
  },
  sugarUsed: [0, 0.5, 0.6, 0.8, 0.9, 0.9, 0.9, 0.9],
  sugarCreated: [0, 2, 2.1, 2.2, 2.3, 2.3, 2.3, 2.3]
};

const case11: ICaseData = {
  inputs: {
    light: InputAmount.Some,
    water: InputAmount.Full,
    co2amount: InputAmount.Some,
  },
  sugarUsed: [0, 0.6, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8],
  sugarCreated: [0, 1.8, 1.9, 2, 2.1, 2.1, 2.1, 2.1]
};

const case12: ICaseData = {
  inputs: {
    light: InputAmount.Full,
    water: InputAmount.Full,
    co2amount: InputAmount.Some,
  },
  sugarUsed: [0, 1, 1.8, 2, 2.3, 2.4, 2.4, 2.4],
  sugarCreated: [0, 1.5, 2.4, 3, 4, 4.5, 4.5, 4.5]
};

const case14: ICaseData = {
  inputs: {
    light: InputAmount.Some,
    water: InputAmount.Some,
    co2amount: InputAmount.Some,
  },
  sugarUsed: [0, 0.4, 0.5, 0.6, 0.7, 0.7, 0.7, 0.7],
  sugarCreated: [0, 1, 1.3, 1.5, 1.6, 1.6, 1.6, 1.6]
};

const case15: ICaseData = {
  inputs: {
    light: InputAmount.Full,
    water: InputAmount.Some,
    co2amount: InputAmount.Some,
  },
  sugarUsed: [0, 0.6, 0.7, 0.8, 0.9, 0.9, 0.9, 0.9],
  sugarCreated: [0, 1.2, 1.5, 1.7, 1.9, 1.9, 1.9, 1.9]
};

const casesWithUniqueValues = [case2, case3, case5, case11, case12, case14, case15];

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
    this.sugarUsed = this.getOutputAmount(this.inputs, index, "sugarUsed");
    this.sugarCreated = this.getOutputAmount(this.inputs, index, "sugarCreated");
  }

  private getOutputAmount(inputs: IModelInputState, index: number, type: "sugarUsed" | "sugarCreated") {
    const {water, light, co2amount} = inputs;
    const isSugarUsed = type === "sugarUsed";
    const noLight = light === InputAmount.None;
    const noCo2 = co2amount === InputAmount.None;

    const compareFunc = (c: ICaseData) => {
      return c.inputs2 ? (equal(c.inputs, inputs) || equal(c.inputs2, inputs)) : equal(c.inputs, inputs);
    };

    if (water === InputAmount.None || index === 0) {
      return 0;
    } else if (isSugarUsed && noLight) {
      return index === 1 ? water === InputAmount.Full ? 1.5 : 1 : 0;
    } else if (isSugarUsed && noCo2) {
      return index === 1 ? 1.7 : 0;
    } else if (!isSugarUsed && (noLight || noCo2)) {
      return 0;
    }

    const amount = casesWithUniqueValues.find(compareFunc)![type][index];
    return amount;
  }
}

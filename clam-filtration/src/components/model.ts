import { EQualitativeAmount, IModelInputState } from "../types";
import { FishStates } from "../utils/sim-utils";

export const kMaxSteps = 650;
const kSimWidth = 481;
const kSimVHeight = 281;
interface ICaseData {
  inputs: IModelInputState,
}

// There are 9 cases total documented

const case1: ICaseData = {
  inputs: {
    algaeStart: EQualitativeAmount.low,
    numClams: 1,
  }
};

export function initialFish() {
  return [
    {name: "A", left: 15, top: 0, direction: "right", affected: false},
    {name: "B", left: 120, top: -10, direction: "left", affected: false},
    {name: "C", left: 130, top: 45, direction: "right", affected: false},
  ];
}

export class Model {
  private frame = 0;
  private inputs: IModelInputState;
  private organisms: Record<any, any[]>
            = {fish: initialFish()};
  constructor(inputs: IModelInputState) {
    this.inputs = inputs;
  }

  public step() {
    if (this.frame > kMaxSteps) return;
    this.frame++;
    this.organisms.fish.forEach((fish: any, idx: number) => {
      this.updateAnimalState(fish, "fish", idx);
    });
  }


  public changeProperties(){
    const index = Math.floor(this.frame * 8);
  }

  private updateAnimalState = (animal: any, animalType: string, idx: number) => {
    const animalActionStates = FishStates;
    const animalYPosition = animal.top;
    let animalXPosition = animal.left;
    const animalFrameIdx = animal.frameIdx
                              ? animal.frameIdx
                              : (animalActionStates && animal.frameIdx !== undefined)
                                ? (idx % animalActionStates.length)
                                : 0;
    let animalDirection = animal.direction;
    let deltaXRef = animal.direction === "right" ? 7 : -7;
    const amplitude = 23;
    const containerHeight = 60;

    const flipDirection = () => {
      deltaXRef = deltaXRef * -1;
      if (animalDirection === "left") { animalDirection = "right"; }
        else { animalDirection = "left"; }
      animal.direction = animalDirection;
    };
      if (animalType !== "water-bird" && (animalXPosition <= 0 || animalXPosition > kSimWidth - 40)) {
        flipDirection();
      }
      animalXPosition = animalXPosition + (deltaXRef/45);
      // We only want to change frame index every 20 frames
      animal.frameIdx =
        this.frame % 20 === 0
          ? (animalActionStates && animalFrameIdx !== undefined)
              ? (animalFrameIdx + 1) % animalActionStates.length
              : animalFrameIdx
          : animalFrameIdx;
      animal.top = animalYPosition + (amplitude * Math.sin((animalXPosition/kSimWidth) * (containerHeight/16) + (this.frame/120))/200);
      animal.left = animalXPosition;
  };

  private getOutputAmount(inputs: IModelInputState, index: number) {
    // TODO need to return the correct output amounts here
    const {algaeStart, numClams} = inputs;
    const algaeEnd = EQualitativeAmount.high;
    const nitrate = EQualitativeAmount.high;
    const turbidity = EQualitativeAmount.high;
  }
}

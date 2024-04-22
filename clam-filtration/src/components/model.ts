import { Amount, IAnimalData, IModelInputState, TOrganisms } from "../types";
import { outputData } from "../utils/data";

export const kMaxSteps = 650;

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
    // this.organisms.fish.forEach((fish: any, idx: number) => {
    //   this.updateAnimalState(fish, idx);
    // });
  }

  public changeProperties(){
    const index = Math.floor(this.time * 6); // 6 is the number of snapshots
    this.algae = this.getOutputAmount(this.inputs, index, "algae");
    this.nitrate = this.getOutputAmount(this.inputs, index, "nitrate");
    this.turbidity = this.getOutputAmount(this.inputs, index, "turbidity");
  }

  // private updateAnimalState = (animal: any, idx: number) => {
  //   const animalActionStates = FishStates;
  //   const animalYPosition = animal.top;
  //   let animalXPosition = animal.left;
  //   const animalFrameIdx = animal.frameIdx
  //                             ? animal.frameIdx
  //                             : (animalActionStates && animal.frameIdx !== undefined)
  //                               ? (idx % animalActionStates.length)
  //                               : 0;
  //   let animalDirection = animal.direction;
  //   console.log("animalYPosition", animalYPosition, "animalXPosition", animalXPosition, "animalFrameIdx", animalFrameIdx, "animalDirection", animalDirection);
  //   let deltaXRef = animal.direction === "right" ? 7 : -7;

  //   const flipDirection = () => {
  //     deltaXRef = deltaXRef * -1;
  //     if (animalDirection === "left") { animalDirection = "right"; }
  //       else { animalDirection = "left"; }
  //     animal.direction = animalDirection;
  //   };
  //     if (animalXPosition <= 0 || animalXPosition > kSimWidth - 40) {
  //       flipDirection();
  //     }
  //     animalXPosition = animalXPosition + (deltaXRef/45);
  //     // We only want to change frame index every 20 frames
  //     animal.frameIdx =
  //       this.time % 20 === 0
  //         ? (animalActionStates && animalFrameIdx !== undefined)
  //             ? (animalFrameIdx + 1) % animalActionStates.length
  //             : animalFrameIdx
  //         : animalFrameIdx;
  //     animal.top = animalYPosition;
  //     animal.left = animalXPosition;
  // };

  private getOutputAmount(inputs: IModelInputState, index: number, type: "algae" | "nitrate" | "turbidity") {
    const months = ["May", "June", "July", "August", "September"];
    const month = months[index];
    const {algaeStart, numClams} = inputs;
    const dataForMonth = outputData[`${algaeStart}${numClams}`]?.find(data => data.month === month);
    return dataForMonth?.output?.[type] || 0;
  }

  public getSimulationState() {
    const percentComplete =  this.time / kMaxSteps;
    const isFinished = this.time >= kMaxSteps;
    // const {fish} = this.organisms;
    // const currentOrganismPositions: Record<TOrganisms, IAnimalData[]>
    //           = {fish: [...fish]};
    return {
      percentComplete,
      isFinished,
      // currentOrganismPositions
    };
  }
}

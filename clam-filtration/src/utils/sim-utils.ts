import Fish0 from "../assets/fish/fish0.svg";
import Fish1 from "../assets/fish/fish1.svg";
import Fish2 from "../assets/fish/fish2.svg";
import Fish3 from "../assets/fish/fish3.svg";
import Clam1 from "../assets/clams/outlines/clam1.svg";
import Clam2 from "../assets/clams/outlines/clam2.svg";
import Clam3 from "../assets/clams/outlines/clam3.svg";
import Clam4 from "../assets/clams/outlines/clam4.svg";
import Clam5 from "../assets/clams/outlines/clam5.svg";
import Clam6 from "../assets/clams/outlines/clam6.svg";
import WaterEffects0 from "../assets/water_effects/waterEffects0.png";
import WaterEffects1 from "../assets/water_effects/waterEffects1.png";
import WaterEffects2 from "../assets/water_effects/waterEffects2.png";
import WaterEffects3 from "../assets/water_effects/waterEffects3.png";
import WaterEffects4 from "../assets/water_effects/waterEffects4.png";
import WaterEffects5 from "../assets/water_effects/waterEffects5.png";
import WaterEffects6 from "../assets/water_effects/waterEffects6.png";
import WaterEffects7 from "../assets/water_effects/waterEffects7.png";
import WaterEffects8 from "../assets/water_effects/waterEffects8.png";
import WaterEffects9 from "../assets/water_effects/waterEffects9.png";
import WaterEffects10 from "../assets/water_effects/waterEffects10.png";
import WaterEffects11 from "../assets/water_effects/waterEffects11.png";
import { IModelInputState } from "../types";
import { outputData } from "./data";

export function linearMap(a:number, b:number, c:number, d:number, t:number){
  const scale = (d-c)/(b-a);
  const offset = -a*(d-c)/(b-a)+c;
  return (t*scale)+offset;
}

export const Clams = [Clam1, Clam2, Clam3, Clam4, Clam5, Clam6];
export const FishStates = [Fish0, Fish1, Fish2, Fish3];
export const WaterEffects = [WaterEffects0,WaterEffects1,WaterEffects2,WaterEffects3,WaterEffects4,WaterEffects5,
                              WaterEffects6,WaterEffects7,WaterEffects8,WaterEffects9,WaterEffects10,WaterEffects11];
export function initialFish() {
  return [
    {name: "A", left: 170, top: 0, direction: "right"},
    {name: "B", left: 465, top: 45, direction: "left"},
    {name: "C", left: -145, top: 85, direction: "right"},
  ];
}

export const getOutputData = (inputs: IModelInputState) => {
  const {algaeStart, numClams} = inputs;
  const algaeLevelText = ["Low", "Medium", "High"];
  const clamDensities = [1, 5, 10];
  return outputData[`${algaeLevelText[algaeStart]}${clamDensities[numClams]}`];
};

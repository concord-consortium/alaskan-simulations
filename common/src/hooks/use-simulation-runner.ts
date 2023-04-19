import { useState } from "react";
import { useCurrent } from "./use-current";

export interface IUseSimulationRunnerResult {
  isRunning: boolean;
  startSimulation: (simulationStep: (realTimeDiff: number) => void, targetFramePeriod?: number) => void;
  endSimulation: () => void;
}

// Use 12 as it's between 8ms (120Hz) and 16ms (60Hz), so it's enough to clearly distinguish between 60Hz and 120Hz.
export const minFramePeriod = 12;

// Using set timeout might result in interval closer to target frame period, but it'll be much less consistent.
// Eg. when client code requests 125ms, intervals might be like 120ms, 130ms, 135ms, 122ms.
// Using requestAnimationFrame we're limited to multiplications of refresh rate, but values should be more consistent.
// Eg. when client code requests 125ms, all intervals will be equal to 133.33ms (8 * 16.66ms).
const USE_SET_TIMEOUT = false;

const scheduleNextFrame = (simulationStep: (realTimeDiff: number) => void, targetFramePeriod: number) => {
  if (USE_SET_TIMEOUT && targetFramePeriod !== minFramePeriod) {
    setTimeout(simulationStep, targetFramePeriod);
  } else {
    requestAnimationFrame(simulationStep);
  }
};

export const useSimulationRunner = (): IUseSimulationRunnerResult => {
  const [isRunning, setIsRunning] = useState(false);
  const currentIsRunning = useCurrent(isRunning);

  const startSimulation = (simulationStep: (realTimeDiff: number) => void, targetFramePeriod = minFramePeriod) => {
    setIsRunning(true);
    currentIsRunning.current = true;

    let lastStepTime = window.performance.now();

    const simulationRunner = (time?: DOMHighResTimeStamp) => {
      if (!time) {
        time = window.performance.now(); // setTimeout doesn't pass time
      }
      if (currentIsRunning.current) {
        scheduleNextFrame(simulationRunner, targetFramePeriod);
        const realTimeDiff = time - lastStepTime;
        if (realTimeDiff < targetFramePeriod) {
          // realTimeDiff is expected to be around 16ms if the monitor has 60Hz refresh rate.
          // Skip every second frame on 120Hz monitors to assume that the target frame rate is always 60Hz.
          return;
        }
        lastStepTime = time;
        simulationStep(realTimeDiff);
      }
    };

    scheduleNextFrame(simulationRunner, targetFramePeriod);
  };

  const endSimulation = () => {
    setIsRunning(false);
  };

  return {
    isRunning,
    startSimulation,
    endSimulation
  };
};

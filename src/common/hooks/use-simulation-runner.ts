import { useState } from "react";
import { useCurrent } from "./use-current";

export interface IUseSimulationRunnerResult {
  isRunning: boolean;
  startSimulation: (simulationStep: (realTimeDiff: number) => void) => void;
  endSimulation: () => void;
}

// Use 12 as it's between 8ms (120Hz) and 16ms (60Hz), so it's enough to clearly distinguish between 60Hz and 120Hz.
export const minFramePeriod = 12;

export const useSimulationRunner = (): IUseSimulationRunnerResult => {
  const [isRunning, setIsRunning] = useState(false);
  const currentIsRunning = useCurrent(isRunning);

  const startSimulation = (simulationStep: (realTimeDiff: number) => void) => {
    setIsRunning(true);
    currentIsRunning.current = true;

    let lastStepTime = window.performance.now();

    const simulationRunner = (time: DOMHighResTimeStamp) => {
      if (currentIsRunning.current) {
        window.requestAnimationFrame(simulationRunner);
        const realTimeDiff = time - lastStepTime;
        if (realTimeDiff < minFramePeriod) {
          // realTimeDiff is expected to be around 16ms if the monitor has 60Hz refresh rate.
          // Skip every second frame on 120Hz monitors to assume that the target frame rate is always 60Hz.
          return;
        }
        lastStepTime = time;
        simulationStep(realTimeDiff);
      }
    };

    window.requestAnimationFrame(simulationRunner);
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

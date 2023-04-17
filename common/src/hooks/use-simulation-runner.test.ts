import { act, renderHook } from "@testing-library/react-hooks";
import { minFramePeriod, useSimulationRunner } from "./use-simulation-runner";

const displayRefreshRate = 250; // test more than 60Hz
const framePeriod = 1000 / displayRefreshRate;

describe("useSimulationRunner", () => {
  let requestAnimationFrameSpy: jest.SpyInstance;
  beforeEach(() => {
    requestAnimationFrameSpy = jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      setTimeout(() => cb(window.performance.now()), framePeriod);
      return 0;
    });
  });

  afterEach(() => {
    requestAnimationFrameSpy.mockRestore();
  });

  it("returns correct state values", () => {
    const HookWrapper = () => useSimulationRunner();
    const { result } = renderHook(HookWrapper);

    expect(result.current.isRunning).toBe(false);
  });

  it("can start and stop simulation and it skips requestAnimationFrame if display refresh rate is bigger than 60", (done) => {
    const HookWrapper = () => useSimulationRunner();
    const { result } = renderHook(HookWrapper);

    act(() => {
      result.current.startSimulation((realTimeDiff: number) => {
        expect(realTimeDiff).toBeGreaterThan(minFramePeriod);
        act(() => {
          result.current.endSimulation();
        });
        expect(result.current.isRunning).toBe(false);
        done();
      });
    });
  });
});

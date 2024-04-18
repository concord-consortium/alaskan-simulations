import React, { useEffect, useState } from "react";
import cslx from "clsx";
import { Amount } from "../../types";
import { Clams, FishStates, WaterEffects, initialFish } from "../../utils/sim-utils";
import Sand from "../../assets/sand_cropped.svg";
import SeagrassStrokes from "../../assets/seagrass_strokes.svg";

import css from "./animation-view.scss";

const kSimWidth = 481;

interface IProps {
  algaeLevel: Amount;
  numClams: Amount;
  time: number;
  turbidity: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeLevel, numClams, time, turbidity, isRunning, isFinished}) => {
  const tempnumclams = 8; //REMOVE when sliders are implemented
  // const numFish = turbidity <= 25 ? 3 : turbidity <= 50 ? 2 : turbidity <= 75 ? 1 : 0;
const numFish = 3; //REMOVE when sliders are implemented
  return (
    <div className={css.viewContainer}>
      <div className={css.animationContainer}>
        <div className={css.top}>
          <div className={css.water}>
            <WaterLoop algaeLevel={Amount.Low} numFish={numFish} isRunning={isRunning} isFinished={isFinished}/>
          </div>
        </div>
        <div className={css.bottom}>
          <SeagrassStrokes className={css.seagrassStrokes}/>
          <Sand className={css.sand}/>
          <div className={css.clams}>
            {Array.from({ length: tempnumclams }).map((_, index) => {
              const Clam = Clams[index % Clams.length];
              return <Clam key={index} className={cslx(css.clam, css[`clam${index}`])} />;
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

interface IWaterLoopProps {
  algaeLevel: Amount;
  numFish: number;
  isRunning: boolean;
  isFinished: boolean;
}

const WaterLoop = ({algaeLevel, numFish, isRunning, isFinished}: IWaterLoopProps) => {
  const [currentEffect, setCurrentEffect] = useState(0);
  const algaeLevelClass = algaeLevel === Amount.High
                            ? css.highAlgae
                            : algaeLevel === Amount.Medium
                                ? css.mediumAlgae : "";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEffect((currentEffect + 1) % WaterEffects.length);
    }, 150);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentEffect]);
  return (
    <div className={css.waterEffects}>
      <img src={WaterEffects[currentEffect]} alt="Water effect" className={css.waterEffect} />
      <div className={cslx(css.waterEffectsOverlay, algaeLevelClass)}>
        <FishContainer numFish={numFish} isRunning={isRunning} isFinished={isFinished}/>
      </div>
    </div>
  );
};

interface IFishContainerProps {
  numFish: number;
  isRunning: boolean;
  isFinished: boolean;
}

const FishContainer = ({numFish, isRunning, isFinished}: IFishContainerProps) => {
    const initFish = initialFish();
    const [fishes, setFishes] = useState(() => Array.from({ length: numFish }, (_, index) => ({
        name: `fish-${index}`,
        top: initFish[index].top,
        left: initFish[index].left,
        frameIdx: index % 4,
        direction: initFish[index].direction
    })));

    // Function to update fish state
    const updateFishState = () => {
      const newFishes = fishes.map(fish => {
        let { left, direction, frameIdx } = fish;
        const deltaX = direction === "right" ? 5 : -5;
        if (left <= -145) {
          direction = "right";
        } else if (left >= kSimWidth) {
          direction = "left";
          left = kSimWidth - 1; // Move the fish slightly inside the boundary
        }
        left += deltaX;
        frameIdx = (frameIdx + 1) % 4;

        return { ...fish, left, direction, frameIdx };
      });
      setFishes(newFishes);
    };

    useEffect(() => {
      if (isRunning && !isFinished) {
        const interval = setInterval(updateFishState, 125); // update every 200ms
        return () => clearInterval(interval); // cleanup on unmount
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fishes, isRunning, isFinished]);

    return (
        <div className={css.fishWrapper}>
          {fishes.map(fish => {
            const FishFrame = FishStates[fish.frameIdx || 0];
            return <FishFrame key={fish.name} className={css.fish}
                      style={{ top: fish.top,
                               left: fish.left,
                               transform: fish.direction === "left" ? "scaleX(-1)" : "scaleX(1)"
                              }} />;
          })}
        </div>
    );
};

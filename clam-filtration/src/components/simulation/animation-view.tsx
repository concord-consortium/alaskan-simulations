import React, { useEffect, useRef, useState } from "react";
import cslx from "clsx";
import { Amount, IAnimalData } from "../../types";
import { Clams, FishStates, WaterEffects, initialFish } from "../../utils/sim-utils";
import Sand from "../../assets/sand_cropped.svg";
import SeagrassStrokes from "../../assets/seagrass_strokes.svg";
import SeagrassOutlines from "../../assets/seagrass_outlines.svg";

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
  const numFish = turbidity <= 25 ? 3 : turbidity <= 50 ? 2 : turbidity <= 75 ? 1 : 0;
  return (
    <div className={css.viewContainer}>
      <div className={css.animationContainer}>
        <div className={css.top}>
          <div className={css.water}>
            <WaterLoop algaeLevel={algaeLevel} numFish={numFish} turbidity={turbidity} isRunning={isRunning} isFinished={isFinished}/>
          </div>
        </div>
        <div className={css.bottom}>
          <SeagrassAnimation isRunning={isRunning}/>
          <Sand className={css.sand}/>
          <div className={css.clams}>
            {Array.from({ length: numClams }).map((_, index) => {
              const Clam = Clams[index % Clams.length];
              return <Clam key={index} className={cslx(css.clam, css[`clam${index}`], {[css.animate]: isRunning})} />;
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
  turbidity: number;
  isRunning: boolean;
  isFinished: boolean;
}

const WaterLoop = ({algaeLevel, numFish, turbidity, isRunning, isFinished}: IWaterLoopProps) => {
  const [currentEffect, setCurrentEffect] = useState(0);
  const algaeLevelClass = turbidity > 61 || (!isRunning && !isFinished && algaeLevel === Amount.High)
                            ? css.highAlgae
                            : turbidity > 31 || (!isRunning && !isFinished && algaeLevel === Amount.Medium)
                                ? css.mediumAlgae : "";
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentEffect((currentEffect + 1) % WaterEffects.length);
      }, 150);

      return () => clearInterval(interval);
    }
  }, [currentEffect, isRunning]);
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

const FishContainer = ({ numFish, isRunning, isFinished }: IFishContainerProps) => {
    const initFish = initialFish();
    const [fishes, setFishes] = useState<IAnimalData[]>([]);

    // Initialize fishes on component mount
    useEffect(() => {
        setFishes(Array.from({ length: numFish }, (_, index) => ({
            name: `fish-${index}`,
            top: initFish[index].top,
            left: initFish[index].left,
            frameIdx: index % 4,
            direction: initFish[index].direction
        })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount, no dependency

    // Update fishes state when numFish changes
    useEffect(() => {
        if (numFish > fishes.length) {
            // Adding new fish
            const newFishes = Array.from({ length: numFish }, (_, index) => {
                return index < fishes.length ? fishes[index] : {
                    name: `fish-${index}`,
                    top: initFish[index % initFish.length].top,
                    left: initFish[index % initFish.length].left,
                    frameIdx: index % 4,
                    direction: initFish[index % initFish.length].direction
                };
            });
            setFishes(newFishes);
        } else if (numFish < fishes.length) {
            // Removing fish if numFish decreases
            setFishes(fishes.slice(0, numFish));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numFish]);

    // Function to update fish state
    const updateFishState = () => {
        const newFishes = fishes.map(fish => {
            let { left, direction, frameIdx = 0 } = fish;
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
            const interval = setInterval(updateFishState, 125); // update every 125ms
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

const SeagrassAnimation = ({isRunning}: {isRunning: boolean}) => {
  const seagrassRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  useEffect(() => {
    const controlAnimation = (svgElement: Element) => {
      const animations = svgElement?.getElementsByTagName("animateTransform");
      if (animations && animations.length > 0) {
        if (isRunning && !isAnimatingRef.current) {
          animations[0].beginElement();
        } else if (!isRunning && isAnimatingRef.current) {
          animations[0].endElement();
        }
      }
    };

    if (seagrassRef.current) {
      const svgOutlines = seagrassRef.current.querySelector(".animation-view-seagrass_outlines");
      const svgStrokes = seagrassRef.current.querySelector(".animation-view-seagrass_strokes");
      if (isRunning && !isAnimatingRef.current) {
        svgOutlines && controlAnimation(svgOutlines);
        svgStrokes && controlAnimation(svgStrokes);
        isAnimatingRef.current = true;
      } else if (!isRunning && isAnimatingRef.current) {
        svgOutlines && controlAnimation(svgOutlines);
        svgStrokes && controlAnimation(svgStrokes);
        isAnimatingRef.current = false;
      }
    }
  }, [isRunning]);
  return (
    <div className={css.seagrass} ref={seagrassRef}>
      <SeagrassStrokes className={css.seagrass_strokes}/>
      <SeagrassOutlines className={css.seagrass_outlines}/>
    </div>
  );
};

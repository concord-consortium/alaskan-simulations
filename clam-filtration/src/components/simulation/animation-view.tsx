import React, { useEffect, useState } from "react";
import { EQualitativeAmount } from "../../types";
import Sand from "../../assets/sand_cropped.svg";
import SeagrassOutline from "../../assets/seagrass_outlines.svg";
import SeagrassStrokes from "../../assets/seagrass_strokes.svg";
import { Clams, WaterEffects } from "../../utils/sim-utils";
import Fish from "../../assets/fish/fish0.svg";

import css from "./animation-view.scss";

interface IProps {
  algaeStart: EQualitativeAmount;
  numClams: number;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeStart, numClams, time, isRunning, isFinished}) => {
  // const algaeClass = css[`algae${algaeStart}`];
  return (
    <div className={css.viewContainer}>
      <div className={css.animationContainer}>
        <div className={css.top}>
          <div className={css.fishWrapper}>
            <Fish className={css.fish}/>
          </div>
          <div className={css.water}>
            <WaterLoop />
          </div>
        </div>
        <div className={css.bottom}>
          <SeagrassOutline className={css.seagrassOutline}/>
          <SeagrassStrokes className={css.seagrassStrokes}/>
          <Sand className={css.sand}/>
        </div>
        <div className={css.clams}>
          {Array.from({ length: numClams }).map((_, index) => {
              const Clam = Clams[index % Clams.length];
              return <Clam key={index} className={css[`clam${index}`]} />;
          })}
          {/* {Clams.map((Clam, index) => <Clam key={index} className={css[`clam${index}`]} />)} */}
        </div>
      </div>
    </div>
  );
};

const WaterLoop = () => {
  const [currentEffect, setCurrentEffect] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEffect((currentEffect + 1) % WaterEffects.length);
    }, 1000); // Change image every 1000ms (1 second)

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentEffect]);

  return (
    <div className={css.waterEffects}>
      <img src={WaterEffects[currentEffect]} alt="Water effect" className={css.waterEffect} />
      <div className={css.waterEffectsOverlay} />
    </div>
  );
};

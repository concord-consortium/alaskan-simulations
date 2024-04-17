import React, { useEffect, useState } from "react";
import cslx from "clsx";
import { EQualitativeAmount } from "../../types";
import { Clams, WaterEffects } from "../../utils/sim-utils";
import Sand from "../../assets/sand_cropped.svg";
import SeagrassStrokes from "../../assets/seagrass_strokes.svg";
import Fish from "../../assets/fish/fish0.svg";

import css from "./animation-view.scss";

interface IProps {
  algaeLevel: EQualitativeAmount;
  numClams: number;
  time: number;
  turbidity: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeLevel, numClams, time, turbidity, isRunning, isFinished}) => {
  const tempnumclams = 8; //REMOVE when sliders are implemented
  const numFish = turbidity <= 25 ? 3 : turbidity <= 50 ? 2 : turbidity <= 75 ? 1 : 0;

  return (
    <div className={css.viewContainer}>
      <div className={css.animationContainer}>
        <div className={css.top}>
          <div className={css.water}>
            <WaterLoop algaeLevel={EQualitativeAmount.low} numFish={numFish}/>
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
  algaeLevel: EQualitativeAmount;
  numFish: number;
}

const WaterLoop = ({algaeLevel, numFish}: IWaterLoopProps) => {
  const [currentEffect, setCurrentEffect] = useState(0);
  const algaeLevelClass = algaeLevel === EQualitativeAmount.high
                            ? css.highAlgae
                            : algaeLevel === EQualitativeAmount.medium
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
        <div className={css.fishWrapper}>
          {Array.from({ length: numFish }).map((_, index) => (
            <Fish key={index} className={cslx(css.fish, css[`fish${index}`])} />
          ))}
        </div>
      </div>
    </div>
  );
};

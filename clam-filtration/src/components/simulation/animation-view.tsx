import React from "react";
import { EQualitativeAmount } from "../../types";
import Sand from "../../assets/sand_cropped.svg";
import SeagrassOutline from "../../assets/seagrass_outlines.svg";
import SeagrassStrokes from "../../assets/seagrass_strokes.svg";
import Clam1 from "../../assets/clams/clam1.svg";
import Clam2 from "../../assets/clams/clam2.svg";
import Clam3 from "../../assets/clams/clam3.svg";
import Clam4 from "../../assets/clams/clam4.svg";
import Clam5 from "../../assets/clams/clam5.svg";
import Clam6 from "../../assets/clams/clam6.svg";
import Fish from "../../assets/fish_frames/fish_00000.svg";

import css from "./animation-view.scss";

interface IProps {
  algaeStart: EQualitativeAmount;
  numClams: number;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const AnimationView: React.FC<IProps> = ({algaeStart, numClams, time, isRunning, isFinished}) => {
  const clams = [Clam1, Clam2, Clam3, Clam4, Clam5, Clam6];
  return (
    <div className={css.viewContainer}>
      <div className={css.animationContainer}>
        <div className={css.top}>
          <div className={css.fishWrapper}>
            <Fish className={css.fish}/>
          </div>
        </div>
        <div className={css.bottom}>
          <SeagrassOutline className={css.seagrassOutline}/>
          <SeagrassStrokes className={css.seagrassStrokes}/>
          <Sand className={css.sand}/>
        </div>
        <div className={css.clams}>
          {clams.map((Clam, index) => <Clam key={index} className={css[`clam${index}`]} />)}
        </div>
      </div>
    </div>
  );
};

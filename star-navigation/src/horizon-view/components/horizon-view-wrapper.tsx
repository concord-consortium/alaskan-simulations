import React from "react";
import { ISimState } from "../types";
import CanvasView from "./canvas-view";

import DownPointer from "../../assets/direction-indicator-down.svg";
import UpPointer from "../../assets/direction-indicator-up.svg";

import css from "./horizon-view-wrapper.scss";

export const HorizonViewWrapper: React.FC<ISimState> = (props) => (
  <div className={css.horizonViewWrapper}>
    <div className={css.sky} />
    <div className={css.stars}>
      <CanvasView simulation={props}/>
    </div>
    <div className={css.daylight} style={{opacity: props.daylightOpacity}} />
    <div className={css.landscape} />
    <div className={css.pointers}>
      <div><DownPointer /></div>
      <div><UpPointer /></div>
    </div>
  </div>
);
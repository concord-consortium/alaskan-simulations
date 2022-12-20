import clsx from "clsx";
import { t } from "../../translation/translate";
import React from "react";
import { CO2Amount, IModelInputState, IModelOutputState } from "../../../types";
import { AnimationView } from "./animation-view";
import css from "./simulation-view.scss";
import { LabeledContainer } from "../containers/labeled-container";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  isRunning: boolean;
  isFinished: boolean;
}


export const SimulationView: React.FC<IProps> = ({input, output, isRunning, isFinished}) => {
  return (
    <LabeledContainer className={css.simulationView} label={t("TERRARIUM")} style="blue">
      <div className={css.terrariumBackGround}/>
      <div className={css.terrariumBackTable}/>
      <div className={css.terrarium}>
        <div className={css.terrariumBack}/>
        {
        ((!isRunning && !isFinished) || output.time === 0) &&
        <div className={css.co2Label}>
          <div className={css.co2LabelText}> <span>CO<sub>2</sub></span>: {t(input.co2amount)} </div>
        </div>
        }
        <div className={css.terrariumFrontGlass}/>
        <div className={clsx({[css.terrariumWater]: input.water, [css.terrariumSoilDry]: input.light, [css.terrariumSoilWet]: input.light && input.water})}/>
        {/* <div className={css.lightLayer}/> */}
      </div>
      <AnimationView light={input.light}  water={input.water} co2Amount={input.co2amount} time={output.time} isRunning={isRunning}/>

    </LabeledContainer>
  );
};

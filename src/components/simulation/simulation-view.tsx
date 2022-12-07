import clsx from "clsx";
import { t } from "../../translation/translate";
import React from "react";
import { CO2Amount, IModelInputState, IModelOutputState } from "../../types";
import { AnimationView } from "./animation-view";
import css from "./simulation-view.scss";
import { LabeledContainer } from "../containers/labeled-container";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  isRunning: boolean;
  isFinished: boolean;
}

export const noToNoneCO2Amount = (amount: CO2Amount) => amount === CO2Amount.No ? CO2Amount.None : amount;

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
          <div className={css.co2LabelText}> <span>CO<sub>2</sub></span>: {t(noToNoneCO2Amount(input.co2amount))} </div>
        </div>
        }
        <div className={css.terrariumFrontGlass}/>
        <div className={clsx({[css.terrariumWater]: input.water, [css.terrariumSoilDry]: input.soil, [css.terrariumSoilWet]: input.soil && input.water})}/>
        <div className={css.lightLayer}/>
      </div>
      <AnimationView soil={input.soil}  water={input.water} co2Amount={input.co2amount} time={output.time} isRunning={isRunning}/>

    </LabeledContainer>
  );
};

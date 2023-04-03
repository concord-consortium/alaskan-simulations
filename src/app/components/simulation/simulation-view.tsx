import clsx from "clsx";
import { t } from "../../translation/translate";
import React from "react";
import { IModelInputState, IModelOutputState, InputAmount } from "../../../types";
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
  const {water, light, co2amount} = input;

  const getClass = (inputAmount: InputAmount) => {
    return inputAmount === InputAmount.Full ? css.full : inputAmount === InputAmount.Some ? css.some : css.none;
  };

  return (
    <LabeledContainer className={css.simulationView} label={t("TERRARIUM")}>
      <div className={css.terrariumBackGround}/>
      <div className={css.ruler}/>
      <div className={css.terrarium}>
        <div className={css.terrariumBack}/>
        {
        ((!isRunning && !isFinished) || output.time === 0) &&
        <div className={css.co2Label}>
          <div className={css.co2LabelText}> <span>CO<sub>2</sub></span>: {t(input.co2amount)} </div>
        </div>
        }
        <div className={css.terrariumFrontGlass}/>
        <div className={clsx(css.soil, getClass(water))}/>
        <div className={clsx(css.light,  getClass(light))}/>
        <div className={clsx(css.terrariumFront, getClass(co2amount))}></div>
      </div>
      <AnimationView light={light}  water={water} co2Amount={co2amount} time={output.time} isRunning={isRunning}/>

    </LabeledContainer>
  );
};

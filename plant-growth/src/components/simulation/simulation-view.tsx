import clsx from "clsx";
import React, { useState } from "react";
import { IModelInputState, IModelOutputState, InputAmount, RulerType } from "../../types";
import { AnimationView } from "./animation-view";
import css from "./simulation-view.scss";
import { LabeledContainer } from "../containers/labeled-container";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  isRunning: boolean;
  isFinished: boolean;
  readOnly?: boolean;
  t: (string: string) => string | JSX.Element;
}


export const SimulationView: React.FC<IProps> = ({input, output, isRunning, isFinished, readOnly, t}) => {
  const {water, light, co2amount} = input;
  const [rulerType, setRulerType] = useState<RulerType>(RulerType.Metric);
  const buttonDisabled = isRunning || readOnly;

  const handleToggleRuler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setRulerType(e.currentTarget.value as RulerType);
  };

  const getClass = (inputAmount: InputAmount) => {
    return inputAmount === InputAmount.Full ? css.full : inputAmount === InputAmount.Some ? css.some : css.none;
  };

  const renderButton = (type: RulerType) => {
    return (
      <div className={clsx(css.buttonContainer, css[type], {[css.disabled]: buttonDisabled, [css.active]: rulerType === type})}>
        <button disabled={buttonDisabled} onClick={handleToggleRuler} value={type}>{type}</button>
      </div>
    );
  };

  return (
    <LabeledContainer className={css.simulationView} label={t("TERRARIUM")}>
      <div className={css.terrariumBackGround}/>
      <div className={clsx(css.ruler, css[rulerType])}/>
      <div className={css.terrarium}>
        <div className={css.terrariumBack}/>
        <div className={css.co2Label}>
          <div className={css.co2LabelText}> <span>CO<sub>2</sub>:</span> {t(input.co2amount)}</div>
        </div>
        <div className={css.terrariumFrontGlass}/>
        <div className={clsx(css.soil, getClass(water))}/>
        <div className={clsx(css.light,  getClass(light))}/>
        <div className={clsx(css.terrariumFront, getClass(co2amount))}/>
        <div className={css.toggle}>
          {renderButton(RulerType.Metric)}
          {renderButton(RulerType.Imperial)}
        </div>
      </div>
      <AnimationView light={light} water={water} co2Amount={co2amount} time={output.time} isRunning={isRunning} isFinished={isFinished}/>
    </LabeledContainer>
  );
};

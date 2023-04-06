import clsx from "clsx";
import { t } from "../../translation/translate";
import React, { useState } from "react";
import { IModelInputState, IModelOutputState, InputAmount } from "../../../types";
import { AnimationView } from "./animation-view";
import css from "./simulation-view.scss";
import { LabeledContainer } from "../containers/labeled-container";
import { Switch } from "../controls/switch";

interface IProps {
  input: IModelInputState
  output: IModelOutputState
  isRunning: boolean;
  isFinished: boolean;
  readOnly?: boolean;
}


export const SimulationView: React.FC<IProps> = ({input, output, isRunning, isFinished, readOnly}) => {
  const {water, light, co2amount} = input;
  const [rulerType, setRulerType] = useState<"metric" | "imperial">("metric");

  const handleToggleRuler = () => {
    if (rulerType === "metric") {
       setRulerType("imperial");
    } else {
      setRulerType("metric");
    }
  };

  const getClass = (inputAmount: InputAmount) => {
    return inputAmount === InputAmount.Full ? css.full : inputAmount === InputAmount.Some ? css.some : css.none;
  };

  return (
    <LabeledContainer className={css.simulationView} label={t("TERRARIUM")}>
      <div className={css.terrariumBackGround}/>
      <div className={clsx(css.ruler, css[rulerType])}/>
      <div className={css.terrarium}>
        <div className={css.terrariumBack}/>
        <div className={css.co2Label}>
          <div className={css.co2LabelText}> <span>CO<sub>2</sub></span>: {t(input.co2amount)} </div>
        </div>
        <div className={css.terrariumFrontGlass}/>
        <div className={clsx(css.soil, getClass(water))}/>
        <div className={clsx(css.light,  getClass(light))}/>
        <div className={clsx(css.terrariumFront, getClass(co2amount))}></div>
        <div className={css.toggleRuler}>
          <Switch
            checked={rulerType === "imperial"}
            disabled={readOnly || isRunning}
            label={""}
            offLabel="cm"
            onLabel={"in"}
            vertical={true}
            onChange={handleToggleRuler}
          />
        </div>
      </div>
      <AnimationView light={light} water={water} co2Amount={co2amount} time={output.time} isRunning={isRunning} isFinished={isFinished}/>
    </LabeledContainer>
  );
};

import React, {useCallback} from "react";
import { IModelInputState, InputAmount } from "../../types";
import { LabeledContainer } from "./containers/labeled-container";
import { InputSlider } from "./controls/input-slider";


import css from "./options-view.scss";


interface IProps {
  inputState: IModelInputState,
  setInputState: (update: Partial<IModelInputState>) => void,
  disabled: boolean,
  t: (string: string) => string | JSX.Element
}

export const OptionsView: React.FC<IProps> = ({inputState, setInputState, disabled, t}) => {

  const handleLightAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({light: value as InputAmount});
  }, [setInputState]);

  const handleWaterAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({water: value as InputAmount});
  }, [setInputState]);

  const handleCO2AmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({co2amount: value as InputAmount});
  }, [setInputState]);

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_TERRARIUM")}>
      <div className={css.optionsContainer}>
          <InputSlider
            type={"LIGHT"}
            labels={["LIGHT_AMOUNT.FULL", "LIGHT_AMOUNT.SOME", "LIGHT_AMOUNT.NONE"]}
            value={inputState.light}
            onChange={handleLightAmountChange}
            disabled={disabled}
            t={t}
          />
          <InputSlider
            type={"WATER"}
            labels={["WATER_AMOUNT.FULL", "WATER_AMOUNT.SOME", "WATER_AMOUNT.NONE"]}
            value={inputState.water}
            onChange={handleWaterAmountChange}
            disabled={disabled}
            t={t}
          />
          <InputSlider
            type={"CO2"}
            labels={["CO2_AMOUNT.FULL", "CO2_AMOUNT.SOME", "CO2_AMOUNT.NONE"]}
            value={inputState.co2amount}
            onChange={handleCO2AmountChange}
            disabled={disabled}
            t={t}
          />
      </div>
    </LabeledContainer>
  );
};

import React, {useCallback} from "react";
import { t, getDefaultLanguage} from "../translation/translate";
import { CO2Amount, IModelInputState, LightAmount, WaterAmount} from "../../types";
import { LabeledContainer } from "./containers/labeled-container";
import { InputSlider } from "./controls/input-slider";


import css from "./options-view.scss";


interface IProps {
  inputState: IModelInputState,
  setInputState: (update: Partial<IModelInputState>) => void,
  disabled: boolean,
}

export const OptionsView: React.FC<IProps> = ({inputState, setInputState, disabled}) => {


  const handleLightAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({light: value as LightAmount});
  }, [setInputState]);

  const handleWaterAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({water: value as WaterAmount});
  }, [setInputState]);

  const handleCO2AmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({co2amount: value as CO2Amount});
  }, [setInputState]);

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_TERRARIUM")} style="violet">
      <div className={css.optionsContainer}>
          <InputSlider
            type={"Light"}
            labels={["LIGHT_AMOUNT.NONE", "LIGHT_AMOUNT.SOME", "LIGHT_AMOUNT.FULL"]}
            value={inputState.light}
            onChange={handleLightAmountChange}
            disabled={disabled}
          />
          <InputSlider
            type={"Water"}
            labels={["WATER_AMOUNT.NONE", "WATER_AMOUNT.SOME", "WATER_AMOUNT.FULL"]}
            value={inputState.water}
            onChange={handleWaterAmountChange}
            disabled={disabled}
          />
          <InputSlider
            type={"CO2"}
            labels={["CO2_AMOUNT.NONE", "CO2_AMOUNT.SOME", "CO2_AMOUNT.FULL"]}
            value={inputState.co2amount}
            onChange={handleCO2AmountChange}
            disabled={disabled}
          />
      </div>
    </LabeledContainer>
  );
};

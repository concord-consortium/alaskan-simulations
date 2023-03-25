import React, {useCallback} from "react";
import { t } from "../translation/translate";
import { IModelInputState, InputAmount } from "../../types";
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
    setInputState({light: value as InputAmount});
  }, [setInputState]);

  const handleWaterAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({water: value as InputAmount});
  }, [setInputState]);

  const handleCO2AmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({co2amount: value as InputAmount});
  }, [setInputState]);

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_TERRARIUM")} style="violet">
      <div className={css.optionsContainer}>
          <InputSlider
            type={"Light"}
            labels={[InputAmount.Full, InputAmount.Some, InputAmount.None]}
            value={inputState.light}
            onChange={handleLightAmountChange}
            disabled={disabled}
          />
          <InputSlider
            type={"Water"}
            labels={[InputAmount.Full, InputAmount.Some, InputAmount.None]}
            value={inputState.water}
            onChange={handleWaterAmountChange}
            disabled={disabled}
          />
          <InputSlider
            type={"CO2"}
            labels={[InputAmount.Full, InputAmount.Some, InputAmount.None]}
            value={inputState.co2amount}
            onChange={handleCO2AmountChange}
            disabled={disabled}
          />
      </div>
    </LabeledContainer>
  );
};

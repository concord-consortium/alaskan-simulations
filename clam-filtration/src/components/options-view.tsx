import { useTranslation } from "common";
import React, { useCallback } from "react";
import { IModelInputState, IModelOutputState, amountLabels, clamLabels } from "../types";
import { LabeledContainer } from "./containers/labeled-container";
import { InputSlider } from "./controls/input-slider";

import css from "./options-view.scss";

interface IProps {
  inputState: IModelInputState;
  setInputState: (update: Partial<IModelInputState>) => void;
  setOutputState: (update: Partial<IModelOutputState>) => void;
  disabled: boolean;
}

export const OptionsView: React.FC<IProps> = ({ inputState, setInputState, setOutputState, disabled }) => {
  const { t } = useTranslation();

  const handleAlgaAmountChange = useCallback((value: number) => {
    setInputState({algaeStart: value});
    setOutputState({algae: null, nitrate: null, turbidity: null});
  }, [setInputState]);

  const handleNumClamsChange = useCallback((value: number) => {
    setInputState({numClams: value});
  }, [setInputState]);

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_CLAM_SIM")}>
      <div className={css.optionsContainer}>
        <InputSlider
          type={"SLIDER_TITLE.ALGAE"}
          labels={amountLabels}
          value={inputState.algaeStart}
          onChange={handleAlgaAmountChange}
          disabled={disabled}
        />
        <InputSlider
          type={"SLIDER_TITLE.NUM_CLAMS"}
          subLabel={"per \n sq. meter"}
          labels={clamLabels}
          value={inputState.numClams}
          onChange={handleNumClamsChange}
          disabled={disabled}
        />
      </div>
    </LabeledContainer>
  );
};

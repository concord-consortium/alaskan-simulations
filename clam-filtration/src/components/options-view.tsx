import { useTranslation } from "common";
import React, { useCallback } from "react";
import { EQualitativeAmount, IModelInputState } from "../types";
import { LabeledContainer } from "./containers/labeled-container";
import { InputSlider } from "./controls/input-slider";

import css from "./options-view.scss";

interface IProps {
  inputState: IModelInputState;
  setInputState: (update: Partial<IModelInputState>) => void;
  disabled: boolean;
}

export const OptionsView: React.FC<IProps> = ({ inputState, setInputState, disabled }) => {
  const { t } = useTranslation();

  const handleAlgaeAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({algaeStart: value as EQualitativeAmount});
  }, [setInputState]);

  const handleNumClamsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({numClams: parseInt(value,10)});
  }, [setInputState]);

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_CLAM_SIM")}>
      <div className={css.optionsContainer}>
          <InputSlider
            type={"SLIDER_TITLE.ALGAE"}
            labels={["EQUALITATIVE_AMOUNT.HIGH", "EQUALITATIVE_AMOUNT.MEDIUM", "EQUALITATIVE_AMOUNT.LOW"]}
            value={inputState.algaeStart}
            onChange={handleAlgaeAmountChange}
            disabled={disabled}
          />
          <InputSlider
            type={"SLIDER_TITLE.NUM_CLAMS"}
            labels={["10", "5", "1"]}
            value={(inputState.numClams).toString()}
            onChange={handleNumClamsChange}
            disabled={disabled}
          />
      </div>
    </LabeledContainer>
  );
};

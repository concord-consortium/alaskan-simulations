import React, {useCallback} from "react";
import { t, getDefaultLanguage} from "../translation/translate";
import { CO2Amount, IModelInputState, LightAmount, WaterAmount} from "../../types";
import { LabeledContainer } from "./containers/labeled-container";
import { RadioButtons } from "./controls/radio-buttons";
import {CheckboxWithImage} from "./controls/checkbox-with-image";
import soilOff from "../assets/soil.png";
import soilOn from "../assets/soil-with-highlight.png";
import waterOff from "../assets/water.png";
import waterOn from "../assets/water-with-highlight.png";
import clsx from "clsx";


import css from "./options-view.scss";


interface IProps {
  inputState: IModelInputState,
  setInputState: (update: Partial<IModelInputState>) => void,
  disabled: boolean,
}

const CO2AmountView = ({label, reverse}: {label: string, reverse: boolean}) => {
  const children = [
    <span key="label">{t(label)}</span>,
    <div key="co2">CO<sub>2</sub></div>
  ];
  if (reverse) {
    children.reverse();
  }
  return (
    <div className={css.optionTextLabel}>
      {children}
    </div>
  );
};

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

  const lang = getDefaultLanguage();

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_TERRARIUM")} style="violet">
      <div>

      <div className={css.optionsContainer}>
          <div className={clsx(css.optionTitle, { [css.disabled]: disabled})}>
            <span>Light</span>
          </div>
          <div className={css.optionsRadioButtons}>
            <RadioButtons
              value={inputState.light}
              label={""}
              name="cover"
              onChange={handleLightAmountChange}
              options={[
                {
                  value: LightAmount.None,
                  label: t("LIGHT_AMOUNT.NONE"),
                  labelPlacement: "top",
                },
                {
                  value: LightAmount.Some,
                  label: t("LIGHT_AMOUNT.SOME"),
                  labelPlacement: "top",
                },
                {
                  value: LightAmount.Full,
                  label: t("LIGHT_AMOUNT.FULL"),
                  labelPlacement: "top",
                }
              ]}
              row={true}
              disabled={disabled}
              color="purple"
              outlineText={true}
            />
          </div>
        </div>

        <div className={css.waterOptionsContainer}>
          <div className={clsx(css.waterOptionsTitle, { [css.disabled]: disabled})}>
            <span>Water</span>
          </div>
          <div className={css.co2OptionsRadioButtons}>
            <RadioButtons
              value={inputState.water}
              label={""}
              name="cover"
              onChange={handleWaterAmountChange}
              options={[
                {
                  value: WaterAmount.None,
                  label: t("WATER_AMOUNT.NONE"),
                  labelPlacement: "top",
                },
                {
                  value: WaterAmount.Some,
                  label: t("WATER_AMOUNT.SOME"),
                  labelPlacement: "top",
                },
                {
                  value: WaterAmount.Full,
                  label: t("WATER_AMOUNT.FULL"),
                  labelPlacement: "top",
                }
              ]}
              row={true}
              disabled={disabled}
              color="purple"
              outlineText={true}
            />
          </div>
        </div>

        <div className={css.co2OptionsContainer}>
          <div className={clsx(css.co2OptionsTitle, { [css.disabled]: disabled})}>
            <span>CO<sub>2</sub></span>
          </div>
          <div className={css.co2OptionsRadioButtons}>
            <RadioButtons
              value={inputState.co2amount}
              label={""}
              name="cover"
              onChange={handleCO2AmountChange}
              options={[
                {
                  value: CO2Amount.No,
                  label: t("CO2_AMOUNT.NONE"),
                  labelPlacement: "top",
                },
                {
                  value: CO2Amount.Low,
                  label: t("CO2_AMOUNT.LOW"),
                  labelPlacement: "top",
                },
                {
                  value: CO2Amount.Normal,
                  label: t("CO2_AMOUNT.NORMAL"),
                  labelPlacement: "top",
                }
              ]}
              row={true}
              disabled={disabled}
              color="purple"
              outlineText={true}
            />
          </div>
        </div>
      </div>
    </LabeledContainer>
  );
};

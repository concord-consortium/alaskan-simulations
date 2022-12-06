import React, {useCallback} from "react";
import { LabeledContainer, t, RadioButtons, getDefaultLanguage} from "common";
import { CO2Amount, IModelInputState} from "../types";
import {CheckboxWithImage} from "common/src/components/controls/checkbox-with-image";
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
    <div className={css.co2TextLabel}>
      {children}
    </div>
  );
};

export const OptionsView: React.FC<IProps> = ({inputState, setInputState, disabled}) => {

  const handleSoilChange = useCallback(() => {
    setInputState({soil: !inputState.soil});
  }, [setInputState, inputState]);

  const handleWaterChange = useCallback(() => {
    setInputState({water: !inputState.water});
  }, [setInputState, inputState]);

  const handleCO2AmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setInputState({co2amount: value as CO2Amount});
  }, [setInputState]);

  const lang = getDefaultLanguage();

  return (
    <LabeledContainer className={css.optionsView} label={t("SETUP_TERRARIUM")} style="violet">
      <div>
        <div className={css.soilAndWaterContainer}>
          <div>
            <CheckboxWithImage
              label={t("TABLE_HEADER.SOIL")}
              color={"purple"}
              urlImageOn={soilOn}
              urlImageOff={soilOff}
              checked={inputState.soil}
              disabled={disabled}
              onClick={handleSoilChange}
            />
          </div>
          <div>
            <CheckboxWithImage
              label={t("TABLE_HEADER.WATER")}
              color={"purple"}
              urlImageOn={waterOn}
              urlImageOff={waterOff}
              checked={inputState.water}
              disabled={disabled}
              onClick={handleWaterChange}
            />
          </div>
        </div>

        <div className={css.dividerLine}/>

        <div className={css.co2OptionsContainer}>
          <div className={clsx(css.co2OptionsTitle, { [css.disabled]: disabled})}>
            {t("SETUP_HEADER_TITLE1")}
            <span>CO<sub>2</sub></span>
            {t("SETUP_HEADER_TITLE2")}
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
                  label: <CO2AmountView label="CO2_AMOUNT.NO" reverse={false} />,
                  labelPlacement: "top",
                },
                {
                  value: CO2Amount.Low,
                  label: <CO2AmountView label="CO2_AMOUNT.LOW" reverse={lang === "es"} />,
                  labelPlacement: "top",
                },
                {
                  value: CO2Amount.Normal,
                  label: <CO2AmountView label="CO2_AMOUNT.NORMAL" reverse={lang === "es"} />,
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

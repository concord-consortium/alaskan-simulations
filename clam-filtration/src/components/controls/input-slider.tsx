import React from "react";
import clsx from "clsx";
import { useTranslation } from "common";

import css from "./input-slider.scss";
import { EQualitativeAmount } from "../../types";

interface IProps {
  type: string;
  value: string;
  labels: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  disabled: boolean;
}

export const InputSlider: React.FC<IProps> = ({ value, onChange, disabled, type, labels }) => {
  const { t } = useTranslation();

  const getClass = () => {
    if (value === EQualitativeAmount.high) {
      return css.full;
    } else if (value === EQualitativeAmount.medium) {
      return css.some;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange", e);
    // onChange(e, numToVal(Number(e.currentTarget.value)));
  };

  return (
    <div className={css.input}>
      <div className={css.type}>{t(type)}</div>
      <div className={css.control}>
        <div className={css.left}>
          <input
            type="range"
            id={type}
            min="0"
            max="2"
            value={value}
            onChange={(e) => handleChange(e)}
            disabled={disabled}
            className={clsx(css.slider, getClass(), {[css.disabled]: disabled})}
            step="1"
            list={`${type}-values`}
          />
        </div>
        <div className={css.right}>
          <datalist className={css.labels} id={`${type}-values`}>
            {labels.map((label, i) => {
              return (
                <div key={label + i} className={clsx({[css.active]: t(value) === t(label)})}>
                  {t(label)}
                </div>
              );
            })}
          </datalist>
        </div>
      </div>
    </div>
  );
};
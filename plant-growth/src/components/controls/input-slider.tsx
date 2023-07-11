import React from "react";
import { InputAmount } from "../../types";
import clsx from "clsx";

import css from "./input-slider.scss";

interface IProps {
  type: string;
  value: string;
  labels: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  disabled: boolean;
  t: (string: string) => string | JSX.Element;
}

export const InputSlider: React.FC<IProps> = ({ value, onChange, disabled, type, labels, t }) => {
  const getClass = () => {
    if (value === InputAmount.Full) {
      return css.full;
    } else if (value === InputAmount.Some) {
      return css.some;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, numToVal(Number(e.currentTarget.value)));
  };

  const numToVal = (num: number) => {
    return num === 0 ? InputAmount.None : num === 1 ? InputAmount.Some : InputAmount.Full;
  };

  const valToNum= (val: string) => {
    return val === InputAmount.None ? 0 : val === InputAmount.Some ? 1 : 2;
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
            value={valToNum(value)}
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

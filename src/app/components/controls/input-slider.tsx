import React from "react";
import clsx from "clsx";
import { t } from "../../translation/translate";

import css from "./input-slider.scss";
import { InputAmount } from "../../../types";

interface IProps {
  type: string;
  value: string;
  labels: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  disabled: boolean;
}

export const InputSlider: React.FC<IProps> = ({ value, onChange, disabled, type, labels }) => {
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
    return num === 0 ? labels[2] : num === 1 ? labels[1] : labels[0];
  };

  const valToNum= (val: string) => {
    return val === labels[2] ? 0 : val === labels[1] ? 1 : 2;
  };

  const titleCase = (str: string) => {
    return `${str[0].toUpperCase() + str.slice(1)}`;
  };

  return (
    <div className={css.input}>
      <div className={css.type}>{type === "CO2" ? <span>CO<sub>2</sub></span> : type}</div>
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
                <option key={label + i} className={clsx({[css.active]: value === label})} value={valToNum(value)} label={titleCase(t(label))}/>
              );
            })}
          </datalist>
        </div>
      </div>
    </div>
  );
};

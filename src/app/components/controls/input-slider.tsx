import React from "react";

import css from "./input-slider.scss";
import { t } from "../../translation/translate";

interface IProps {
  type: string;
  value: string;
  labels: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  disabled?: boolean;
}

export const InputSlider: React.FC<IProps> = ({ value, onChange, disabled, type, labels }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, numToVal(Number(e.currentTarget.value)));
  };

  const numToVal = (num: number) => {
    return num === 0 ? labels[0] : num === 1 ? labels[1] : labels[2];
  };

  const valToNum= (val: string) => {
    return val === labels[0] ? 0 : val === labels[1] ? 1 : 2;
  };

  const titleCase = (str: string) => {
    return `${str[0].toUpperCase() + str.slice(1)}`;
  };

  return (
    <div className={css.input}>
      <div className={css.type}>{type === "CO2" ? <span>CO<sub>2</sub></span> : type}</div>
      <div className={css.control}>
        <div className={css.left}>
          <input type="range" id={type} min="0" max="2" value={valToNum(value)} onChange={(e) => handleChange(e)} className={css.slider} step="1" list={`${type}-values`}></input>
        </div>
        <div className={css.right}>
          <datalist className={css.labels} id={`${type}-values`}>
            <option value="2" label={titleCase(t(labels[2]))}></option>
            <option value="1" label={titleCase(t(labels[1]))}></option>
            <option value="0" label={titleCase(t(labels[0]))}></option>
          </datalist>
        </div>
      </div>
    </div>
  );
};
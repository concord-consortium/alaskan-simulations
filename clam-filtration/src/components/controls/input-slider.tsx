import React from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import { Amount } from "../../types";

import css from "./input-slider.scss";

interface IProps {
  type: string;
  value: number;
  labels: Record<Amount, string>;
  onChange: (value: number) => void;
  disabled: boolean;
  subLabel?: string;
}

export const InputSlider: React.FC<IProps> = ({ value, onChange, subLabel, disabled, type, labels }) => {
  const { t } = useTranslation();

  const getClass = () => {
    return value === Amount.High ? css.high : value === Amount.Medium ? css.medium : css.low;
  };

  const labelArray = Object.keys(labels).map((key) => labels[Number(key) as Amount]).reverse();

  return (
    <div className={css.input}>
      <div className={css.type}>{t(type)}</div>
      {subLabel && <div className={css.subLabel}>{subLabel}</div>}
      <div className={clsx(css.control, {[css.disabled]: disabled})}>
        <div className={css.left}>
          <input
            type="range"
            id={type}
            min={0}
            max={2}
            value={value}
            onChange={(e) => onChange(Number(e.currentTarget.value))}
            disabled={disabled}
            className={clsx(css.slider, getClass(), {[css.disabled]: disabled})}
            step="1"
            list={`${type}-values`}
          />
        </div>
        <div className={css.right}>
          <datalist className={css.labels} id={`${type}-values`}>
            {labelArray.map((label, i) => {
              return (
                <div key={label + i} className={clsx({[css.active]: labels[value as Amount] === label})}>
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

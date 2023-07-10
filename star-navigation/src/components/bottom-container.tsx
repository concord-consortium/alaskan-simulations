import React from "react";
import {
  Slider, Option, ScrollingSelect, t
} from "common";
import { IModelInputState, Month } from "../types";

import css from "./bottom-container.scss";

interface IProps {
  inputState: IModelInputState;
  disableInputs: boolean;
  onTimeOfDayChange: (value: number) => void;
  onMonthChange: (value: number) => void;
}

export const BottomContainer: React.FC<IProps> = ({ inputState, disableInputs, onMonthChange, onTimeOfDayChange }) => {

  const handleTimeOfDayChange = (event: Event, value: number) => {
    onTimeOfDayChange(value);
  };

  const handleMonthChange = (value: string | null) => {
    onMonthChange(Number(value) || 1);
  };

  return (
    <div className={css.bottomContainer}>
      <div className={css.row}>
        <div className={css.timeSliderContainer}>
          <Slider
            value={inputState.timeOfDay}
            min={0}
            max={24}
            step={1}
            label={""}
            onChange={handleTimeOfDayChange}
          />
        </div>
      </div>
      <div className={css.row}>
        <ScrollingSelect value={inputState.month !== null ? inputState.month.toString() : null} onChange={handleMonthChange} disabled={disableInputs}>
          <Option value="1">{t(Month.January)}</Option>
          <Option value="2">{t(Month.February)}</Option>
          <Option value="3">{t(Month.March)}</Option>
          <Option value="4">{t(Month.April)}</Option>
          <Option value="5">{t(Month.May)}</Option>
          <Option value="6">{t(Month.June)}</Option>
          <Option value="7">{t(Month.July)}</Option>
          <Option value="8">{t(Month.August)}</Option>
          <Option value="9">{t(Month.September)}</Option>
          <Option value="10">{t(Month.October)}</Option>
          <Option value="11">{t(Month.November)}</Option>
          <Option value="12">{t(Month.December)}</Option>
        </ScrollingSelect>
      </div>
    </div>
  );
};

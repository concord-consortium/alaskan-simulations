import React from "react";
import clsx from "clsx";

import css from "./experiment-buttons.scss";

interface IProps {
  activeRunIdx?: number;
  onChangeRunIdx: (runIdx: number) => void;
  disabled?: boolean;
  narrow?: boolean;
}

export const ExperimentButtons: React.FC<IProps> = ({ disabled, activeRunIdx, onChangeRunIdx, narrow }) => {
  const handleChangeRunIdx = (e: React.MouseEvent<HTMLButtonElement>) => {
     onChangeRunIdx(Number(e.currentTarget.value));
  };

  return (
    <div className={clsx(css.experimentButtons, {[css.narrow]: narrow})}>
      {[0, 1, 2, 3].map((exp) => {
        return (
          <div key={`exp-div-${exp}`} className={css.buttonContainer}>
            <button
              key={`exp-button-${exp}`}
              value={exp}
              disabled={disabled}
              onClick={handleChangeRunIdx}
              className={clsx(css.experimentButton, { [css.current]: activeRunIdx === exp, [css.disabled]: disabled })}
            >
              {exp + 1}
            </button>
          </div>
        );
      })}
    </div>
  );
};

import React from "react";
import { clsx } from "clsx";

import css from "./button.scss";

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export const Button: React.FC<IProps> = ({ children, className, onClick, selected, disabled }) => {
  return (
    <button
      className={clsx(css.button, className, { [css.selected]: selected, [css.disabled]: disabled })}
      disabled={disabled || selected}
      onClick={onClick}
    >
      { children }
    </button>
  );
};

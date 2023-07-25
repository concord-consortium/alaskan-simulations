import React from "react";
import { clsx } from "clsx";

import css from "./button.scss";

interface IProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<IProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={clsx(css.button, className)}
      onClick={onClick}
    >
      { children }
    </button>
  );
};

import React from "react";
import clsx from "clsx";

import css from "./labeled-container.scss";

interface IProps {
  label: string|JSX.Element;
  labelStyle?: "white";
  className?: string;
  centerLabel?: boolean;
  children?: React.ReactNode;
}

export const LabeledContainer:  React.FC<IProps> = (props) => {
  const { label, className, centerLabel, children } = props;
  return (
    <div className={clsx(css.labeledContainer, className)}>
      { children }
    </div>
  );
};


import React from "react";
import clsx from "clsx";

import css from "./labeled-container.scss";

interface IProps {
  label: string;
  style: "blue" | "violet";
  labelStyle?: "white";
  className?: string;
  centerLabel?: boolean;
  largerStyle?: boolean;
}

export const LabeledContainer:  React.FC<IProps> = (props) => {
  const { label, style, labelStyle, largerStyle, className, centerLabel, children } = props;
  return (
    <div className={clsx(css.labeledContainer, css[style], className, {[css.larger]: largerStyle})}>
      <div className={clsx(css.label, {[css.centerLabel]: centerLabel, [css.larger]: largerStyle, [css.white]: labelStyle === "white"})}>{ label }</div>
      { children }
    </div>
  );
};


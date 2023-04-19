import React from "react";
import clsx from "clsx";

import css from "./button.scss";

interface IProps {
  label?: string;
  innerLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  horizontal?: boolean;
  height?: number;
  width?: number;
  largerStyle?: boolean;
  className?: string;
  innerButtonClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { label, innerLabel, icon, disabled, onClick, horizontal, height, width, largerStyle, className, innerButtonClassName } = props;
  const divStyle: React.CSSProperties = { height, width };

  return (
    <button
      ref={ref}
      tabIndex={0}
      className={clsx(css.buttonContainer, className, { [css.disabled]: disabled, [css.larger]: largerStyle })}
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      disabled={disabled}
    >
      { label && <div className={clsx(css.label, {[css.larger]: largerStyle})}>{ label }</div> }
      <div style={divStyle} className={clsx(css.innerButton, innerButtonClassName, {[css.larger]: largerStyle, [css.withInnerLabel]: innerLabel, [css.withIcon]: icon, [css.horizontal]: horizontal })}>
        { icon && <div className={clsx(css.icon, {[css.larger]: largerStyle})}>{ icon }</div> }
        { innerLabel && <div className={css.innerLabel}>{ innerLabel }</div> }
      </div>
    </button>
  );
});

Button.displayName = "Button";

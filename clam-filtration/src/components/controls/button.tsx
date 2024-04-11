import React from "react";
import clsx from "clsx";

import css from "./button.scss";

interface IProps {
  label?: string|JSX.Element;
  ariaLabel?: string;
  innerLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  horizontal?: boolean;
  height?: number;
  width?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { label, ariaLabel, innerLabel, icon, disabled, onClick, horizontal, height, width } = props;
  const divStyle: React.CSSProperties = { height, width };

  return (
    <div className={css.buttonContainer}>
      { label && <div className={css.label}>{ label }</div> }
      <button
        ref={ref}
        tabIndex={0}
        className={clsx(css.button, { [css.disabled]: disabled})}
        onClick={disabled ? undefined : onClick}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <div
          style={divStyle}
          className={clsx(css.innerButton, { [css.withInnerLabel]: innerLabel, [css.withIcon]: icon, [css.horizontal]: horizontal })}>
          { icon && <div className={css.icon}>{ icon }</div> }
          { innerLabel && <div className={css.innerLabel}>{ innerLabel }</div> }
        </div>
      </button>
    </div>
  );
});

Button.displayName = "Button";

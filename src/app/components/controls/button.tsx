import React from "react";
import clsx from "clsx";

import css from "./button.scss";

interface IProps {
  label?: string|JSX.Element;
  innerLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  horizontal?: boolean;
  height?: number;
  width?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { label, innerLabel, icon, disabled, onClick, horizontal, height, width } = props;
  const divStyle: React.CSSProperties = { height, width };

  return (
    <button
      ref={ref}
      tabIndex={0}
      className={`${css.buttonContainer} ${disabled ? css.disabled : ""}`}
      onClick={disabled ? undefined : onClick}
      // aria-label={label}
      disabled={disabled}
    >
      { label && <div className={css.label}>{ label }</div> }
      <div style={divStyle} className={clsx(css.innerButton, { [css.withInnerLabel]: innerLabel, [css.withIcon]: icon, [css.horizontal]: horizontal })}>
        { icon && <div className={css.icon}>{ icon }</div> }
        { innerLabel && <div className={css.innerLabel}>{ innerLabel }</div> }
      </div>
    </button>
  );
});

Button.displayName = "Button";

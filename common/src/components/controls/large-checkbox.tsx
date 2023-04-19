import React from "react";
import clsx from "clsx";
import CheckMarkIcon from "../../assets/check-mark-icon.svg";

import css from "./large-checkbox.scss";

interface IProps {
  checked: boolean;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const LargeCheckbox = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { label, checked, disabled, onClick, className } = props;

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <div className={clsx(css.largeCheckbox, className, { [css.disabled]: disabled })} onClick={handleClick}>
      <button
        ref={ref}
        className={clsx(css.buttonContainer, { [css.disabled]: disabled })}
        aria-label={label}
        disabled={disabled}
      >
        <CheckMarkIcon className={clsx({ [css.checkmarkOn]: checked, [css.checkmarkOff]: !checked })} />
      </button>
    </div>
  );
});

LargeCheckbox.displayName = "LargeCheckbox";

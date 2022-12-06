import React from "react";
import clsx from "clsx";

import CheckMarkIcon from "../../assets/list-check-icon.svg";

import css from "./checkbox-with-image.scss";

interface IProps {
  label: string;
  urlImageOn: string;
  urlImageOff: string;
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
  icon?: React.ReactNode;
}

export const CheckboxWithImage = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { label, color, urlImageOn, urlImageOff, checked, disabled, onClick } = props;

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className={clsx(css.checkboxWithImage, {[css.disabled]: disabled})} onClick={handleClick}>

      { label && <div className={clsx(css.label, {[css.disabled]: disabled})}>{ label }</div> }

      <div className={clsx(css.imageContainer, {[css.disabled]: disabled})}>
        <div className={css.urlImageOnHover}>
          <img src={urlImageOn}/>
        </div>
        <div className={css.urlImageRemoveHover}>
          <img src={checked ? urlImageOn: urlImageOff}/>
        </div>
      </div>

      <div className={css.bottomContainer}>
        <button
          ref={ref}
          tabIndex={0}
          className={clsx(css.buttonContainer, {[css.disabled]: disabled})}
          aria-label={label}
          disabled={disabled}
        >
          <div className={css.innerButton}>
            <CheckMarkIcon className={clsx({[css.checkmarkOn]: checked, [css.checkmarkOff]: !checked, [css.purple]: color === "purple"})}/>
          </div>
        </button>
      </div>
    </div>
  );
});

CheckboxWithImage.displayName = "Button";

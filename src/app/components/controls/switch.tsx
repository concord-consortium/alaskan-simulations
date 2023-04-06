import React from "react";
import clsx from "clsx";
import { useSwitch } from "@mui/base";

import css from "./switch.scss";

interface IProps {
  checked: boolean;
  label: string;
  offLabel?: string;
  onLabel?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  vertical?: boolean;
  disabled?: boolean;
}

export const Switch: React.FC<IProps> = (props) => {
  const { label, offLabel, onLabel, vertical, ...restProps } = props;
  const { getInputProps, checked, disabled, focusVisible } = useSwitch(restProps);

  console.log("checked", checked);

  const switchClasses = {
    [css.switch]: true,
    [css.disabled]: disabled,
    [css.focusVisible]: focusVisible,
    [css.vertical]: vertical
  };

  const switchRootClasses = {
    [css.switchRoot]: true,
    [css.checked]: checked,
    [css.vertical]: vertical
  };

  return (
    <div className={clsx(switchClasses)}>
      <div className={css.label}>{ label }</div>
      <div className={clsx(css.switchContainer, {[css.vertical]: vertical})}>
        <span className={clsx(css.offLabel, {[css.active]: !checked})}>{ offLabel }</span>
        <span className={clsx(switchRootClasses)}>
          <span className={css.thumb} />
          {/* input element is positioned on top of the thumb and rail, and it needs to match their dimensions.
              This element is invisible (opacity=0), but it catches all mouse events. This is standard Material UI
              implementation. I believe it's done that way for accessibility reasons. */}
          <input {...getInputProps()} aria-label={label} />
        </span>
        <span className={clsx(css.onLabel, {[css.active]: checked})}>{ onLabel }</span>
      </div>
    </div>
  );
};

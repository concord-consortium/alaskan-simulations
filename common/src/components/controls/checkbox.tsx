import React from "react";
import { clsx } from "clsx";
import { Checkbox as MUICheckbox, CheckboxProps } from "@mui/material";
import CheckMark from "../../assets/check-mark.svg";

import css from "./checkbox.scss";

const Icon = () => (
  <div className={css.icon} />
);

const CheckedIcon = () => (
  <div className={clsx(css.icon, css.checked)}>
    <CheckMark />
  </div>
);

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { className, ...restOfProps } = props;
  return (
    <MUICheckbox
      disableRipple={true}
      icon={<Icon />}
      checkedIcon={<CheckedIcon />}
      className={clsx(css.checkbox, className)}
      {...restOfProps}
    />
  );
};

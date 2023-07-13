import React from "react";
import { clsx } from "clsx";
import { Checkbox as MUICheckbox, CheckboxProps } from "@mui/material";

import css from "./large-toggle.scss";

const Icon = ({ img }: { img: string }) => (
  <div className={css.icon}>
    <img src={img} alt="default image" />
  </div>
);

const CheckedIcon = ({ img }: { img: string }) => (
  <div className={clsx(css.icon, css.checked)}>
    <img src={img} alt="checked image" />
  </div>
);

interface IProps extends CheckboxProps {
  image: string;
  checkedImage: string;
}

export const LargeToggle: React.FC<IProps> = (props) => {
  const { className, checkedImage, image, ...restOfProps } = props;
  return (
    <MUICheckbox
      disableRipple={true}
      icon={<Icon img={image} />}
      checkedIcon={<CheckedIcon img={checkedImage} />}
      className={clsx(css.largeToggle, className)}
      {...restOfProps}
    />
  );
};

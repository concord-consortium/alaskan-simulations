import React from "react";
import { useTranslation } from "common";
import { Button } from "./button";
import AddIcon from "../../assets/add-icon.svg";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
}

const WIDTH = 40;

export const NewRunButton: React.FC<IProps> = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled } = props;
  const { t, tStringOnly } = useTranslation();

  return (
    <Button
      ref={ref}
      label={t("BUTTON.TRIAL")}
      ariaLabel={tStringOnly("BUTTON.NEW")}
      innerLabel={tStringOnly("BUTTON.NEW")}
      icon={<AddIcon />}
      onClick={onClick}
      disabled={disabled}
      width={WIDTH}
    />
  );
});

NewRunButton.displayName = "NewRunButton";

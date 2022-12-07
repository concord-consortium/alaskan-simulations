import React from "react";
import { t } from "../../translation/translate";
import { Button } from "./button";
import AddIcon from "../../assets/add-icon.svg";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
}

const WIDTH = 52; // to keep Spanish and English button widths the same

export const NewRunButton: React.FC<IProps> = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled } = props;
  return (
    <Button
      ref={ref}
      label={t("BUTTON.TRIAL")}
      innerLabel={t("BUTTON.NEW")}
      icon={<AddIcon />}
      onClick={onClick}
      disabled={disabled}
      width={WIDTH}
    />
  );
});

NewRunButton.displayName = "NewRunButton";

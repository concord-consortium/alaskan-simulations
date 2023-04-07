import React from "react";
import { Button } from "./button";
import AddIcon from "../../assets/add-icon.svg";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
  t: (string: string) => string | JSX.Element;
}

const WIDTH = 52; // to keep Spanish and English button widths the same

export const NewRunButton: React.FC<IProps> = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled, t } = props;
  return (
    <Button
      ref={ref}
      label={t("BUTTON.TRIAL")}
      innerLabel={t("BUTTON.NEW") as string}
      icon={<AddIcon />}
      onClick={onClick}
      disabled={disabled}
      width={WIDTH}
    />
  );
});

NewRunButton.displayName = "NewRunButton";

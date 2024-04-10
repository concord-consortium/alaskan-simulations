import React from "react";
import { Button } from "./button";
import PlayIcon from "../../assets/play-icon.svg";
import { useTranslation } from "common";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const PlayButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled } = props;
  const { t, tStringOnly } = useTranslation();

  return <Button ref={ref} ariaLabel={tStringOnly("BUTTON.PLAY")} label={t("BUTTON.PLAY")} icon={<PlayIcon />} onClick={onClick} disabled={disabled} />;
});

PlayButton.displayName = "PlayButton";

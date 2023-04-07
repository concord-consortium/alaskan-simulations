import React from "react";
import { Button } from "./button";
import PlayIcon from "../../assets/play-icon.svg";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
  t: (string: string) => string | JSX.Element
}

export const PlayButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled, t } = props;
  return <Button ref={ref} label={t("BUTTON.PLAY")} icon={<PlayIcon />} onClick={onClick} disabled={disabled} />;
});

PlayButton.displayName = "PlayButton";

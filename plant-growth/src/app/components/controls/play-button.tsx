import React from "react";
import { Button } from "./button";
import PlayIcon from "../../assets/play-icon.svg";
import { translations } from "../../translations";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
  t: (string: string) => string | JSX.Element
}

export const PlayButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled, t } = props;
  return <Button ref={ref} ariaLabel={translations["BUTTON.PLAY"].string} label={t("BUTTON.PLAY")} icon={<PlayIcon />} onClick={onClick} disabled={disabled} />;
});

PlayButton.displayName = "PlayButton";

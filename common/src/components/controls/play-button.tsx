import React from "react";
import { t } from "../..";
import { Button } from "./button";
import PlayIcon from "../../assets/play-icon.svg";
import PlayIconLarge from "../../assets/play-icon-large.svg";

interface IProps {
  onClick?: () => void;
  disabled?: boolean;
  largerStyle?: boolean;
}

export const PlayButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { onClick, disabled, largerStyle } = props;
  return <Button
    largerStyle={largerStyle}
    ref={ref}
    label={t("BUTTON.PLAY")}
    icon={largerStyle ? <PlayIconLarge/> : <PlayIcon />}
    onClick={onClick}
    disabled={disabled}
  />;
});

PlayButton.displayName = "PlayButton";

import React, {useState, useCallback} from "react";
import { translations } from "../translations";
import clsx from "clsx";

import css from "./use-translation.scss";

interface IProps {
  isRunning: boolean;
}

export const useTranslation = (props: IProps) => {
  const [readAloudMode, setReadAloudMode] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeAudioId, setActiveAudioId] = useState<string>("");
  const {isRunning} = props;

  const t = useCallback((string: string) => {
    const stringToRender = string === "CO2" ? <span>CO<sub>2</sub></span> : translations[string].string;
    if (readAloudMode && "mp3" in translations[string]) {
      const audio = new Audio(translations[string].mp3);
      audio.addEventListener("playing", () => {
        setIsAudioPlaying(true);
        setActiveAudioId(string);
      });
      audio.addEventListener("ended", () => {
        setIsAudioPlaying(false);
        setActiveAudioId("");
      });
      const handlePlay = () => {
        if (!isDisabled) {
          audio.load()
          audio.play();
        }
      };

      const isActive = isAudioPlaying && activeAudioId === string;
      const isDisabled = isRunning || (isAudioPlaying && activeAudioId !== string);

      const classes = {
        [css.readAloud]: true,
        [css.active]: isActive,
        [css.disabled]: isDisabled
      };

      return (
        <div onClick={handlePlay}>
          <span className={clsx(classes)}>{stringToRender}</span>
        </div>
      );
    } else {
      return stringToRender;
    }
  }, [readAloudMode, isAudioPlaying, isRunning, activeAudioId]);

  return {
    t,
    readAloudMode,
    setReadAloudMode
  };
};

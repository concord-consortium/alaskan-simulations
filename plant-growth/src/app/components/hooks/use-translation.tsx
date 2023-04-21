import React, {useState} from "react";
import { useSaveInteractiveState } from "./use-interactive-state";
import { translations } from "../translations";
import clsx from "clsx";

import css from "./use-translation.scss";

interface IProps {
  isRunning: boolean,
  initialReadAloudMode: boolean|undefined
}

interface ITranslationProps {
  string: string,
  readAloudMode: boolean,
  isAudioPlaying: boolean,
  setIsAudioPlaying: (bool: boolean) => void,
  isRunning: boolean
}

const Translation = (props: ITranslationProps) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const {string, readAloudMode, isRunning, isAudioPlaying, setIsAudioPlaying} = props;
  const stringToRender = string === "CO2" ? <span>CO<sub>2</sub></span> : translations[string].string;

  if (readAloudMode && "mp3" in translations[string]) {
    const audio = new Audio(translations[string].mp3);

    audio.addEventListener("playing", () => {
      setIsAudioPlaying(true);
      setClicked(true);
    });

    audio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
      setClicked(false);
    });

    const handlePlay = () => {
      if (!isDisabled && !isAudioPlaying) {
        audio.load();
        audio.play();
      }
    };

    const isActive = isAudioPlaying && clicked;
    const isDisabled = isRunning || (isAudioPlaying && !clicked);

    const classes = {
      [css.readAloud]: true,
      [css.active]: isActive,
      [css.disabled]: isDisabled || isAudioPlaying
    };

    return (
      <div onClick={handlePlay}>
        <span className={clsx(classes)}>{stringToRender}</span>
      </div>
    );
  } else {
    return <div>{stringToRender}</div>;
  }
}

export const useTranslation = (props: IProps) => {
  const {isRunning, initialReadAloudMode} = props;
  const [readAloudMode, setReadAloudMode] = useState<boolean>(initialReadAloudMode!);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const { saveInteractiveState } = useSaveInteractiveState();

  const t = (string: string) => {
    return (
      <Translation
        readAloudMode={readAloudMode}
        string={string}
        isAudioPlaying={isAudioPlaying}
        setIsAudioPlaying={setIsAudioPlaying}
        isRunning={isRunning} />
    );
  };

  const handleSetReadAloudMode = (onOrOff: boolean) => {
    setReadAloudMode(onOrOff);
    saveInteractiveState({readAloudMode: onOrOff});
  };

  return {
    t,
    readAloudMode,
    setReadAloudMode: handleSetReadAloudMode
  };
};

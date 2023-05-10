import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
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
  isRunning: boolean,
  markDown?: boolean
  isAudioPlaying: boolean,
  setIsAudioPlaying: (bool: boolean) => void;
}

const Translation = (props: ITranslationProps) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement>();
  const {string, readAloudMode, isRunning, markDown, isAudioPlaying, setIsAudioPlaying} = props;
  const stringToRender = string === "CO2" ? <span>CO<sub>2</sub></span> : translations[string].string;

  useEffect(() => {
    if ("mp3" in translations[string] && readAloudMode) {
      setCurrentAudio(translations[string].mp3);
    } else if ("mp3" in translations[string] && !readAloudMode) {
      currentAudio?.pause();
      setClicked(false);
      setCurrentAudio(undefined);
    } else {
      setCurrentAudio(undefined);
    }
  }, [readAloudMode, currentAudio, string]);

  if (currentAudio) {
    currentAudio.addEventListener("playing", () => {
        setIsAudioPlaying(true);
    });

    currentAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false);
      setClicked(false);
    });

    const isActive = isAudioPlaying && clicked;
    const isDisabled = isRunning || (isAudioPlaying && !clicked);

    const handlePlay = () => {
      console.log("isAudioPlaying", isAudioPlaying);
      if (!isDisabled && !isAudioPlaying) {
        setClicked(true);
        currentAudio.load();
        currentAudio.play();
      }
    };

    const classes = {
      [css.readAloud]: readAloudMode,
      [css.active]: isActive,
      [css.disabled]: isDisabled || isAudioPlaying
    };

    return (
      <div className={css.container} onClick={handlePlay}>
        <span className={clsx(classes)}>
          {markDown ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{stringToRender as string}</ReactMarkdown> : stringToRender}
        </span>
      </div>
    );
  } else {
    return <span>{markDown ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{stringToRender as string}</ReactMarkdown> : stringToRender}</span>;
  }
};

export const useTranslation = (props: IProps) => {
  const {isRunning, initialReadAloudMode} = props;
  const readAloud = initialReadAloudMode !== undefined ? initialReadAloudMode : false;
  const [readAloudMode, setReadAloudMode] = useState<boolean>(readAloud);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const { saveInteractiveState } = useSaveInteractiveState();

  const t = (string: string, markDown?: boolean) => {
    return (
      <Translation
        readAloudMode={readAloudMode}
        string={string}
        isAudioPlaying={isAudioPlaying}
        isRunning={isRunning}
        markDown={markDown}
        setIsAudioPlaying={setIsAudioPlaying}
      />
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

import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useSaveInteractiveState } from "./use-interactive-state";
import clsx from "clsx";

import css from "./use-translation.scss";

export interface ITranslation {
  string: string;
  mp3?: HTMLAudioElement;
}

export type TranslationDict = Record<string, ITranslation>;

interface ITranslationProps {
  string: string;
  readAloudMode: boolean;
  isRunning: boolean;
  translations: TranslationDict;
  isAnyAudioPlaying: boolean;
  setIsAnyAudioPlaying: (bool: boolean) => void;
  markDown?: boolean;
}

const Translation = (props: ITranslationProps) => {
  const [isAudioSelected, setIsAudioSelected] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>();
  const {string, readAloudMode, isRunning, markDown, isAnyAudioPlaying, setIsAnyAudioPlaying, translations} = props;
  const stringToRender = string === "CO2" ? <span>CO<sub>2</sub></span> : translations[string].string;

  useEffect(() => {
    if ("mp3" in translations[string] && readAloudMode) {
      setAudioElement(translations[string].mp3);
    } else if ("mp3" in translations[string] && !readAloudMode && audioElement) {
      audioElement.pause();
      setIsAudioSelected(false);
    } else {
      setAudioElement(undefined);
    }

    // If audio is playing from dialog box, pause audio once dialog is closed.
    return (() => {
      audioElement?.pause();
      setIsAudioSelected(false);
    });

  }, [readAloudMode, audioElement, string, translations]);

  useEffect(() => {
    if (audioElement) {
      const handlePlaying = () => {setIsAnyAudioPlaying(true);};
      const handleEnded = () => {
        setIsAnyAudioPlaying(false);
        setIsAudioSelected(false);
      };
      audioElement.addEventListener("playing", handlePlaying);
      // If audio element is paused (because readAloudMode was turned off), treat as audio ended
      audioElement.addEventListener("pause", handleEnded);
      audioElement.addEventListener("ended", handleEnded);
     // cleanup
      return () => {
         audioElement.removeEventListener("playing", handlePlaying);
         audioElement.addEventListener("pause", handleEnded);
         audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioElement, setIsAnyAudioPlaying]);

  if (audioElement) {
    const handlePlay = () => {
      if (!isRunning && !isAnyAudioPlaying && readAloudMode) {
        setIsAudioSelected(true);
        audioElement.load();
        audioElement.play();
      }
    };

    const classes = {
      [css.readAloud]: readAloudMode,
      [css.active]: isAnyAudioPlaying && isAudioSelected,
      [css.disabled]: isRunning || (isAnyAudioPlaying && !isAudioSelected) || isAnyAudioPlaying,
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

interface IProps {
  isRunning: boolean,
  translations: TranslationDict;
  initialReadAloudMode?: boolean;
}

export const useTranslation = (props: IProps) => {
  const {isRunning, initialReadAloudMode, translations} = props;
  const readAloud = initialReadAloudMode !== undefined ? initialReadAloudMode : false;
  const [readAloudMode, setReadAloudMode] = useState<boolean>(readAloud);
  const [isAnyAudioPlaying, setIsAnyAudioPlaying] = useState<boolean>(false);

  const { saveInteractiveState } = useSaveInteractiveState();

  useEffect(() => {
    return (() => {
      setIsAnyAudioPlaying(false);
    });
  }, []);

  const t = (string: string, markDown?: boolean) => {
    return (
      <Translation
        translations={translations}
        readAloudMode={readAloudMode}
        string={string}
        isAnyAudioPlaying={isAnyAudioPlaying}
        isRunning={isRunning}
        markDown={markDown}
        setIsAnyAudioPlaying={setIsAnyAudioPlaying}
      />
    );
  };

  const handleSetReadAloudMode = (onOrOff: boolean) => {
    setReadAloudMode(onOrOff);
    // If user turns off readAloudMode and audio is playing, pause the audio.
    if (!onOrOff) {
      setIsAnyAudioPlaying(false);
    }
    saveInteractiveState({readAloudMode: onOrOff});
  };

  return {
    t,
    readAloudMode,
    setReadAloudMode: handleSetReadAloudMode
  };
};

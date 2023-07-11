import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  translations: TranslationDict;
  isAnyAudioPlaying: boolean;
  setIsAnyAudioPlaying: (bool: boolean) => void;
  markDown?: boolean;
  disabled?: boolean;
}

const Translation = (props: ITranslationProps) => {
  const [isAudioSelected, setIsAudioSelected] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>();
  const { string, readAloudMode, disabled, markDown, isAnyAudioPlaying, setIsAnyAudioPlaying, translations } = props;
  const translationData = useMemo(() => translations[string] || {}, [string, translations]);
  const stringToRender = string === "CO2" ? <span>CO<sub>2</sub></span> : (translationData?.string || string);

  useEffect(() => {
    if ("mp3" in translationData && readAloudMode) {
      setAudioElement(translationData.mp3);
    } else if ("mp3" in translationData && !readAloudMode && audioElement) {
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

  }, [readAloudMode, audioElement, string, translationData]);

  useEffect(() => {
    if (audioElement) {
      const handlePlaying = () => { setIsAnyAudioPlaying(true); };
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
      if (!disabled && !isAnyAudioPlaying && readAloudMode) {
        setIsAudioSelected(true);
        audioElement.load();
        audioElement.play();
      }
    };

    const classes = {
      [css.readAloud]: readAloudMode,
      [css.active]: isAnyAudioPlaying && isAudioSelected,
      [css.disabled]: disabled || (isAnyAudioPlaying && !isAudioSelected) || isAnyAudioPlaying,
    };

    return (
      <span className={css.container} onClick={handlePlay}>
        <span className={clsx(classes)}>
          {markDown ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{stringToRender as string}</ReactMarkdown> : stringToRender}
        </span>
      </span>
    );
  } else {
    return <span>{markDown ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{stringToRender as string}</ReactMarkdown> : stringToRender}</span>;
  }
};

export interface ITranslationContextProps {
  translations: TranslationDict;
  readAloudMode: boolean;
  setReadAloudMode: (onOrOff: boolean) => void;
  isAnyAudioPlaying: boolean;
  setIsAnyAudioPlaying: (bool: boolean) => void;
  disabled?: boolean,
}

// It's a bit untypical pattern, but useTranslation accepts both props or tries to obtain them from context.
// This lets the top-level component provide props, so it's not necessary to move all UI and logic to the child
// component. However, components lower in the component tree can simply use useTranslation without any props.
export const useTranslation = (props?: ITranslationContextProps) => {
  const propsFromContext = useContext(TranslationContext);
  const {
    disabled, translations, readAloudMode, setReadAloudMode, isAnyAudioPlaying, setIsAnyAudioPlaying
  } = props || propsFromContext;

  const { saveInteractiveState } = useSaveInteractiveState();

  useEffect(() => {
    return (() => {
      setIsAnyAudioPlaying(false);
    });
  }, [setIsAnyAudioPlaying]);

  const t = (string: string, markDown?: boolean) => (
    <Translation
      translations={translations}
      readAloudMode={readAloudMode}
      string={string}
      isAnyAudioPlaying={isAnyAudioPlaying}
      disabled={disabled}
      markDown={markDown}
      setIsAnyAudioPlaying={setIsAnyAudioPlaying}
    />
  );

  const tStringOnly = (string: string) => translations[string]?.string;

  const handleSetReadAloudMode = (onOrOff: boolean) => {
    setReadAloudMode(onOrOff);
    // If user turns off readAloudMode and audio is playing, pause the audio.
    if (!onOrOff) {
      setIsAnyAudioPlaying(false);
    }
    saveInteractiveState({ readAloudMode: onOrOff });
  };

  return {
    t, tStringOnly,
    readAloudMode,
    setReadAloudMode: handleSetReadAloudMode
  };
};

export const TranslationContext = createContext<ITranslationContextProps>({
  translations: {},
  readAloudMode: false,
  setReadAloudMode: () => undefined,
  isAnyAudioPlaying: false,
  setIsAnyAudioPlaying: () => undefined,
});

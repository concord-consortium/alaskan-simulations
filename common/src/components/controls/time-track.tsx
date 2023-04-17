import React from "react";
import clsx from "clsx";
import { t } from "common";
import RadioButton from "../../assets/radio-button-large.svg";

import css from "./time-track.scss";

interface IMarkSpec {
  fadeOnTime: number;
  fadeOffTime: number;
  label: string;
  onClick: () => void;
  timeValue: number;
}

interface IProps {
  isFinished: boolean;
  isRunning: boolean;
  time: number;
  fadeOnTransition: number; // seconds
  fadeOffTransition: number; // seconds
  trackSegmentTransition: number; // seconds
  marks: [IMarkSpec, IMarkSpec, IMarkSpec]
}

export const TimeTrack: React.FC<IProps> = ({ isFinished, isRunning, marks, time, fadeOnTransition, fadeOffTransition,
  trackSegmentTransition }) => {

  const getIsSelected = (i: number) => {
    const isLastMark = i === marks.length - 1;
    return marks[i].timeValue === time || isLastMark && time > marks[i].timeValue;
  };

  const getMarkClasses = (i: number) => ({
    [css.fadeOn]: time >= marks[i].fadeOnTime && time < marks[i].fadeOffTime,
    [css.fadeOff]: time >= marks[i].fadeOffTime,
    // Note that simulation might be running again after it's finished (user replays its segment).
    [css.finished]: !isRunning && isFinished,
    [css.selected]: !isRunning && isFinished && getIsSelected(i)
  });

  return (
    <div className={css.timeTrack}>
      {
        isRunning &&
        <style>
        {
          // It's a pretty pattern to add styles like that, but that's probably the simplest / cleanest way to specify
          // transition durations in JS and pass them to CSS.
          `.${css.mark}.${css.fadeOn} * {
            transition: stroke ${fadeOnTransition}s;
            transition: fill ${fadeOnTransition}s;
          }
          .${css.mark}.${css.fadeOff} * {
            transition: fill ${fadeOffTransition}s;
          }
          .${css.label} {
            transition: opacity ${fadeOnTransition}s;
          }
          .${css.track}:not(.${css.finished}) {
            transition: width ${trackSegmentTransition * 1.3}s;
          }`
          // * 1.3 because part of the track needs to overlap with radio buttons and it's hidden. So, the transition
          // needs to be longer, so when the track touches the next radio button, it starts to fade on.
          // 1.3 value was tested empirically.
        }
        </style>
      }
      <div className={clsx(css.mainContainer)}>
        <div className={css.markContainer}>
          <div className={clsx(css.label, getMarkClasses(0))}>
            {t(marks[0].label)}
          </div>
          <button disabled={isRunning || !isFinished} className={clsx(css.mark, getMarkClasses(0))} onClick={marks[0].onClick} title={t(marks[0].label)}>
            <RadioButton />
          </button>
        </div>

        <div className={css.bar}>
          <div className={clsx(css.track, getMarkClasses(0))} />
        </div>

        <div className={css.markContainer}>
          <div className={clsx(css.label, getMarkClasses(1))}>
            {t(marks[1].label)}
          </div>
          <button disabled={isRunning || !isFinished} className={clsx(css.mark, getMarkClasses(1))} onClick={marks[1].onClick} title={t(marks[1].label)}>
            <RadioButton />
          </button>
        </div>

        <div className={css.bar}>
          <div className={clsx(css.track, getMarkClasses(1))} />
        </div>

        <div className={css.markContainer}>
          <div className={clsx(css.label, getMarkClasses(2))}>
            {t(marks[2].label)}
          </div>
          <button disabled={isRunning || !isFinished} className={clsx(css.mark, getMarkClasses(2))} onClick={marks[2].onClick} title={t(marks[2].label)}>
            <RadioButton />
          </button>
        </div>
      </div>
    </div>
  );
};

import clsx from "clsx";
import React, { Children, KeyboardEvent } from "react";

import BackIcon from "../../assets/back-icon.svg";
import ForwardIcon from "../../assets/forward-icon.svg";

import css from "./scrolling-select.scss";

// a hack to quickly peer into the <Option ..> elements passed as children
interface IOptionChild {
  props: {
    value: string;
    children: string;
  }
}

interface IProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled: boolean;
}

export const ScrollingSelect: React.FC<IProps> = ({ value, onChange, disabled, children }) => {
  const childArray = Children.toArray(children) as IOptionChild[];
  const selectedChildIndex = childArray.findIndex(c => c.props.value === value);
  const selectedChild = childArray[selectedChildIndex];

  const handleBack = () => {
    let newIndex = selectedChildIndex - 1;
    if (newIndex < 0) {
      newIndex = childArray.length - 1;
    }
    onChange(childArray[newIndex].props.value);
  };

  const handleForward = () => {
    const newIndex = (selectedChildIndex + 1) % childArray.length;
    onChange(childArray[newIndex].props.value);
  };

  const handleKeyDown = (callback: () => void) => {
    return (e: KeyboardEvent<HTMLDivElement>) => {
      if ((e.code === "Enter") || (e.code === "Space")) {
        e.preventDefault();
        callback();
      }
    };
  };

  return (
    <div className={clsx(css.scrollingSelect, {[css.disabled]: disabled})}>
      <div
        className={clsx(css.selector, css.left)}
        onClick={handleBack}
        onKeyDown={handleKeyDown(handleBack)}
        role="button"
        tabIndex={0}
      >
        <BackIcon />
      </div>
      <div className={css.value}>{selectedChild.props.children}</div>
      <div
        className={clsx(css.selector, css.right)}
        onClick={handleForward}
        onKeyDown={handleKeyDown(handleForward)}
        role="button"
        tabIndex={0}
      >
        <ForwardIcon />
      </div>
    </div>
  );
};

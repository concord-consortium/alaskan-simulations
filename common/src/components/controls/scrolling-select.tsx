import clsx from "clsx";
import React, { Children, KeyboardEvent } from "react";
import BackIcon from "../../assets/back-icon.svg";

import css from "./scrolling-select.scss";

interface IOptionProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Option: React.FC<IOptionProps> = ({ value, disabled, children }) => (
  <option value={value} disabled={disabled}>{ children }</option>
);

// a hack to quickly peer into the <Option ..> elements passed as children
interface IOptionChild {
  props: {
    value: string;
    children: string;
  }
}

interface IProps {
  value: string | null;
  disabled?: boolean;
  valueMinWidth?: number;
  className?: string;
  // Variant with Option children requires onChange
  children?: React.ReactNode;
  onChange?: (value: string | null) => void;
  // When there are no Option children, it can be a combination of two button - back and forward.
  onBackClick?: () => void;
  onForwardClick?: () => void;
}

export const ScrollingSelect: React.FC<IProps> = ({ value, className, valueMinWidth, onChange, onBackClick, onForwardClick, disabled, children }) => {
  const childArray = Children.toArray(children) as IOptionChild[];
  const selectedChildIndex = childArray.findIndex(c => c.props.value === value);
  const selectedChild = childArray[selectedChildIndex];

  const handleBack = () => {
    if (childArray.length > 0) {
      let newIndex = selectedChildIndex - 1;
      if (newIndex < 0) {
        newIndex = childArray.length - 1;
      }
      onChange?.(childArray[newIndex].props.value);
    } else {
      onBackClick?.();
    }
  };

  const handleForward = () => {
    if (childArray.length > 0) {
      const newIndex = (selectedChildIndex + 1) % childArray.length;
      onChange?.(childArray[newIndex].props.value);
    } else {
      onForwardClick?.();
    }
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
    <div className={clsx(css.scrollingSelect, className, {[css.disabled]: disabled})}>
      <div
        className={clsx(css.selector, css.left)}
        onClick={handleBack}
        onKeyDown={handleKeyDown(handleBack)}
        role="button"
        tabIndex={0}
      >
        <BackIcon />
      </div>
      <div className={css.value} style={{ minWidth: valueMinWidth }}>{selectedChild ? selectedChild.props.children : value}</div>
      <div
        className={clsx(css.selector, css.right)}
        onClick={handleForward}
        onKeyDown={handleKeyDown(handleForward)}
        role="button"
        tabIndex={0}
      >
        <BackIcon style={{transform: "rotate(180deg)"}} />
      </div>
    </div>
  );
};

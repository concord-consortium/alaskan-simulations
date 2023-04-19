import React from "react";
import clsx from "clsx";
import { SelectUnstyled, OptionUnstyled } from "@mui/base";
import { Popper } from "@mui/material";

import css from "./select.scss";

interface ISelectProps {
  value: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  listLocation?: "below" | "above"
  style?: "blue" | "violet"
  largerStyle?: boolean;
  shadow?: boolean;
}

// forces the Select/Popper to alway show the listbox above the initial button
const TopPopper = (props: any) => <Popper {...props} placement="top-start" />;

export const Select: React.FC<ISelectProps> = ({ value, onChange, placeholder, disabled, listLocation, style, largerStyle, shadow, children }) => {
  const className = clsx(css.select, css[style || "blue"], {
    [css.above]: listLocation === "above",
    [css.larger]: largerStyle,
    [css.shadow]: shadow
  });

  return (
    <div className={className}>
      <SelectUnstyled
        value={value}
        disabled={disabled}
        onChange={onChange}
        renderValue={(renderedValue) => {
          if (!renderedValue) {
            return placeholder;
          }
          return renderedValue.label;
        }}
        components={listLocation === "above" ? {Popper: TopPopper} : undefined}
      >
        { children }
      </SelectUnstyled>
    </div>
  );
};

interface IOptionProps {
  value: string;
  disabled?: boolean;
}

export const Option: React.FC<IOptionProps> = ({ value, disabled, children }) => (
  <OptionUnstyled value={value} disabled={disabled}>{ children }</OptionUnstyled>
);

interface IReadOnlySelectProps {
  value: string|null;
  disabled?: boolean;
}

export const ReadOnlySelect: React.FC<IReadOnlySelectProps> = ({ value, disabled, children }) => (
  <div className={clsx(css.readOnlySelect, {[css.disabled]: disabled})}>{value}</div>
);

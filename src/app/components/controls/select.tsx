import React from "react";
import { OptionUnstyled } from "@mui/base";

interface IOptionProps {
  value: string;
  disabled?: boolean;
}

export const Option: React.FC<IOptionProps> = ({ value, disabled, children }) => (
  <OptionUnstyled value={value} disabled={disabled}>{ children }</OptionUnstyled>
);

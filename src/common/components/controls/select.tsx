import React, {MouseEvent, KeyboardEvent, FocusEvent} from "react";
// import clsx from "clsx";
import { OptionUnstyled } from "@mui/base";
// import { Popper } from "@mui/material";

// import css from "./select.scss";

// interface ISelectProps {
//   value: string | null;
//   onChange?: (e: MouseEvent<Element, React.MouseEvent> | KeyboardEvent<Element> | FocusEvent<Element, Element> | null, value: string | null) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   listLocation?: "below" | "above"
//   style?: "blue" | "violet"
// }

// // forces the Select/Popper to alway show the listbox above the initial button
// const TopPopper = (props: any) => <Popper {...props} placement="top-start" />;

// export const Select: React.FC<ISelectProps> = ({ value, onChange, placeholder, disabled, listLocation, style, children }) => (
//   <div className={clsx(css.select, css[style || "blue"], {[css.above]:  listLocation === "above"})}>
//     <SelectUnstyled
//       value={value}
//       disabled={disabled}
//       onChange={onChange}
//       renderValue={(renderedValue) => {
//         if (!renderedValue) {
//           return placeholder;
//         }
//         return renderedValue.label;
//       }}
//       components={listLocation === "above" ? {Popper: TopPopper} : undefined}
//     >
//       { children }
//     </SelectUnstyled>
//   </div>
// );

interface IOptionProps {
  value: string;
  disabled?: boolean;
}

export const Option: React.FC<IOptionProps> = ({ value, disabled, children }) => (
  <OptionUnstyled value={value} disabled={disabled}>{ children }</OptionUnstyled>
);

import * as React from "react";
import clsx from "clsx";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioButtonIcon from "../../assets/radio-button.svg";

import css from "./radio-buttons.scss";

interface IOption {
  value: string;
  label: string | JSX.Element;
  disabled?: boolean;
  image?: string;
  checkedImage?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom"
}

interface IProps {
  value: string;
  label?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  options: IOption[];
  row?: boolean;
  disabled?: boolean;
  color?: "purple";
  outlineText?: boolean;
}

export const RadioButtons: React.FC<IProps> = (props) => {
  const { value, label, name, onChange, options, row, disabled, color, outlineText} = props;
  const labelId = `${name}-label`;

  const renderIcon = (option: IOption) => {
    const icon = <RadioButtonIcon className={css.radioButtonIcon}/>;

    if (option.image && option.checkedImage) {
      // add both images tagged with classes for hover image switching if both images exist
      return (
        <div className={css.imageRadioButton}>
          <img src={option.image} className={css.normalImage} />
          <img src={option.checkedImage} className={css.hoverImage} />
          {icon}
        </div>
      );
    } else if (option.image) {
      return (
        <div className={css.imageRadioButton}>
          <img src={option.image}/>
          {icon}
        </div>
      );
    } else {
      return icon;
    }
  };

  const renderCheckedIcon = (option: IOption) => {
    const icon = <RadioButtonIcon className={clsx({[css.radioButtonIcon]: true, [css.checked]: true })}/>;

    if (option.checkedImage) {
      return (
        <div className={css.imageRadioButton}>
          <img src={option.checkedImage} />
          {icon}
        </div>
      );
    } else {
      return icon;
    }
  };


  return (
    <FormControl className={css.radioFormControl} disabled={disabled} >
      {label && <FormLabel className={css.mainLabel} id={labelId}>{ label }</FormLabel>}

      <RadioGroup
       className={css.radioGroup}
        row={row}
        aria-labelledby={labelId}
        name={name}
        value={value}
        onChange={onChange}
      >
        {
          options.map(option => (
            <FormControlLabel
              className={clsx(css.radioLabelRoot, {[css.purple]: color === "purple", [css.outlineText]: outlineText && option.value === value})}
              key={option.value}
              value={option.value}
              label={option.label}
              disabled={option.disabled}
              labelPlacement={option.labelPlacement}
              control={
                <Radio
                  className={css.radioRoot}
                  icon={renderIcon(option)}
                  checkedIcon={renderCheckedIcon(option)}
                  disableRipple={true}
                />
              }

            />
          ))
        }
      </RadioGroup>
    </FormControl>
  );
};

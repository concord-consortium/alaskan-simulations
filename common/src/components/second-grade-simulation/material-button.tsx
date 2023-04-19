import React from "react";
import clsx from "clsx";
import { t, Draggable } from "common";

import css from "./material-button.scss";

interface IProps {
  material: string;
  svg: React.ReactNode;
  draggable: React.ReactNode;
  locationId?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}

const MaterialButtonBasic: React.FC<Partial<IProps>> = ({ svg, disabled }) => (
  <div className={clsx(css.materialButton, { [css.disabled]: disabled })}>
    {svg}
  </div>
);

const MaterialButtonPlaced: React.FC<IProps> = ({ svg, disabled }) => (
  <div className={clsx(css.placed)}>
    <MaterialButtonBasic svg={svg} disabled={disabled}/>
  </div>
);

const DragPreview: React.FC<IProps> = ({ draggable }) => (
  <div className={css.dragPreview}>
    {draggable}
  </div>
);

export const MaterialButton: React.FC<IProps> = (props) => {
  const { material, locationId, disabled, hideLabel } = props;
  const placed = !!locationId;

  return (
    <div className={css.materialContainer}>
      <Draggable
        id={material}
        label={t(material)}
        droppableId={locationId}
        hideButtonOnDrag={placed}
        disabled={disabled}
        DragPreview={<DragPreview {...props} />}
      >
        {
          placed ? <MaterialButtonPlaced {...props} /> : <MaterialButtonBasic {...props} />
        }
      </Draggable>
      { !hideLabel && !placed && <span className={clsx(css.materialLabel, {[css.disabled]: disabled})}>{t(material)}</span> }
    </div>
  );
};

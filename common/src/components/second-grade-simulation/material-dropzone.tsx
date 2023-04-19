import React, { useState } from "react";
import clsx from "clsx";
import { useDroppable } from "@dnd-kit/core";
import { t, useClickToDragDroppable } from "common";
import { MaterialButton } from "./material-button";
import CloseButton from "./close-button.svg";

import css from "./material-dropzone.scss";

interface IProps {
  id: string;
  disabled?: boolean;
  material?: string;
  handleRemoveMaterial: () => void;
  style?: React.CSSProperties;
  materialsArray: Array<{name: string, svg: JSX.Element, draggable: JSX.Element}>;
}

export const MaterialDropzone: React.FC<IProps> = (props) => {
  const { id, disabled, material, style, materialsArray } = props;
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const [hoverState, setHoverState] = useState<boolean>(false);
  const { active, isOver, setNodeRef } = useDroppable({ id, disabled });
  const { onClick, anyDraggableSelected } = useClickToDragDroppable(id);

  const classes = clsx({
    [css.materialDropzone]: true,
    [css.isMaterialOver]: isOver,
    [css.isMaterialPlaced]: material,
    [css.disabled]: disabled,
    [css.anyDraggableSelected]: anyDraggableSelected,
    [css.hoverState]: hoverState
  });

  const materialForButton = materialsArray.find((mat) => mat.name === material);
  // this is hacky but it's used since "anyDraggableSelected" only returns true with click-click events, not click-and-drag.
  // active id will be something like "[material]_INSIDE_[temperature]" if we are moving an item from a dropzone.
  const movingFromDropZone = active?.id.includes("INSIDE");
  const currentDropZoneIsActive = active?.id.includes(id);
  const showLabel = !material ? true : currentDropZoneIsActive ? movingFromDropZone : false;

  const handleOnMouseOver = () => {
    setShowDeleteButton(true);
  };

  const handleOnMouseLeave = () => {
    setShowDeleteButton(false);
    setHoverState(false);
  };

  const handleOnDeleteButtonHover = () => {
    setHoverState(true);
  };

  const handleOnDeleteButtonLeave = () => {
    setHoverState(false);
  };

  const handleRemoveMaterial = () => {
    setHoverState(false);
    setShowDeleteButton(false);
    props.handleRemoveMaterial();
  };

  return (
    <div className={clsx(css.container, {[css.spanish]: document.documentElement.lang === "es"})} style={style}>
      <div className={css.header}>{t(id)}</div>
      <div className={classes} onMouseOver={handleOnMouseOver} onMouseLeave={handleOnMouseLeave} ref={setNodeRef} onClick={onClick}>
        {material && !movingFromDropZone && !disabled && showDeleteButton &&
          <button
            onMouseOver={handleOnDeleteButtonHover}
            onMouseLeave={handleOnDeleteButtonLeave}
            onClick={handleRemoveMaterial}
            className={css.closeButton}>
            <CloseButton/>
          </button>
        }
        <div className={css.content}>
          { material && materialForButton &&
            <MaterialButton
              material={materialForButton.name}
              svg={materialForButton.svg}
              draggable={materialForButton.draggable}
              locationId={id}
              disabled={disabled}
            /> }
          { showLabel && <div className={css.label}>{t("INSTRUCTIONS.DRAG")}</div> }
        </div>
        <div className={css.border}/>
      </div>
    </div>
  );
};

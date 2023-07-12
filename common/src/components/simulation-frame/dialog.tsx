import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import * as focusTrap from "focus-trap";
import { Button } from "../controls/button";
import { simulationFrameHeaderId } from "./simulation-frame";
import CloseButtonSvg from "../../assets/close-button.svg";

import css from "./dialog.scss";

interface IProps {
  title: string|JSX.Element;
  modal?: boolean;
  closeButtonLabel?: string;
  noMaxHeight?: boolean;
  onClose?: () => void;
  showCloseButton: boolean;
  trapFocus: boolean;
  zIndex?: number;
  addSeparator?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Dialog: React.FC<IProps> = ({ title, modal, closeButtonLabel, noMaxHeight, onClose, showCloseButton, trapFocus, zIndex, addSeparator, className, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const containerStyle: React.CSSProperties = zIndex ? {zIndex} : {};

  useEffect(() => {
    if (modal && dialogRef.current && trapFocus) {
      // simulationFrameHeaderId is used too, so user can toggle credits or directions dialogs.
      const trap = focusTrap.createFocusTrap([dialogRef.current, `#${simulationFrameHeaderId}`]);
      trap.activate();
      return () => { trap.deactivate(); };
    }
  }, [modal, trapFocus]);

  return (
    <div ref={dialogRef} className={clsx(css.dialogContainer, className, { [css.modal]: modal })} style={containerStyle}>
      <div className={css.dialog}>
        <div className={css.header}>
          <span className={css.title}>
            {title}
          </span>
          {showCloseButton && <div className={css.close} onClick={onClose}><CloseButtonSvg /></div>}
        </div>
        {addSeparator && <div className={css.seperator} />}
        <div className={clsx(css.content, {[css.noMaxHeight]: noMaxHeight})}>
          { children }
        </div>
        {
          modal && closeButtonLabel &&
          <div className={css.buttonContainer}>
            <Button innerLabel={closeButtonLabel} onClick={onClose} />
          </div>
        }
      </div>
    </div>
  );
};

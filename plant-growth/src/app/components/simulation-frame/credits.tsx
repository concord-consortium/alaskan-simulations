import React from "react";
import { Dialog } from "./dialog";

import css from "./credits.scss";

interface IProps {
  onClose: () => void;
  t: (string: string) => string | JSX.Element
}

export const Credits:  React.FC<IProps> = ({onClose, t}) => {
  return (
    <Dialog title={t("CREDITS.HEADER")} onClose={onClose} noMaxHeight={true} showCloseButton={true} trapFocus={false}>
      <div className={css.credits}>
        TBD
      </div>
    </Dialog>
  );
};


import React from "react";
import clsx from "clsx";
import { Dialog } from "./dialog";
import { t } from "../../translation/translate";

import css from "./credits.scss";

interface IProps {
  onClose: () => void;
}

export const Credits:  React.FC<IProps> = ({onClose}) => {
  return (
    <Dialog title={t("CREDITS.HEADER")} onClose={onClose} noMaxHeight={true} showCloseButton={true} trapFocus={false}>
      <div className={css.credits}>
        "TBD"
      </div>
    </Dialog>
  );
};


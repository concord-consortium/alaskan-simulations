import React from "react";
import { Dialog } from "./dialog";
import { useTranslation } from "../../hooks/use-translation";

import css from "./credits.scss";

interface IProps {
  onClose: () => void;
}

export const Credits:  React.FC<IProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog title={t("CREDITS.HEADER")} onClose={onClose} noMaxHeight={true} showCloseButton={true} trapFocus={false}>
      <div className={css.credits}>
        TBD
      </div>
    </Dialog>
  );
};


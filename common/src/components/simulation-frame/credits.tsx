import React from "react";
import clsx from "clsx";
import { Dialog } from "./dialog";
import { t } from "../..";

import css from "./credits.scss";

interface IProps {
  onClose: () => void;
}

export const Credits:  React.FC<IProps> = ({onClose}) => {
  return (
    <Dialog title={t("CREDITS.HEADER")} onClose={onClose} noMaxHeight={true} showCloseButton={true} trapFocus={false}>
      <div className={css.credits}>
        <div className={css.header}>
          {t("CREDITS.TITLE")}<sup>TM</sup>
        </div>
        <div className={css.splitter}>
          <div>
            <div className={css.label}>
              {t("CREDITS.DEVELOPED_AT")}
              <div className={css.lhsLogo} title={t("CREDITS.THE_LAWRENCE_HALL_OF_SCIENCE")} />
            </div>
          </div>
          <div className={css.borderLeft}>
            <div className={css.label}>
              {t("CREDITS.PUBLISHED_BY")}
              <div className={css.deltaLogo} title={t("CREDITS.DELTA_EDUCATION")} />
              <div className={css.schoolSpecialityLogo} title={t("CREDITS.SCHOOL_SPECIALTY")} />
            </div>
            <div className={clsx(css.label, css.borderTop)}>
              {t("CREDITS.DEVELOPED_BY")}
              <div className={css.ccLogo} title={t("CREDITS.THE_CONCORD_CONSORTIUM")} />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};


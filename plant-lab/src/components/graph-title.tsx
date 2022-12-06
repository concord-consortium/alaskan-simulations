import React from "react";
import {t} from "common";
import css from "./graph-title.scss";

interface IProps {
  days: string;
}

export const GraphTitle: React.FC<IProps> = ({days}) => {
  return (
    <div className={css.graphTitleContainer}>
      {t("GRAPH.TITLE")}
      <div className={css.daysContainer}>
        {days}
      </div>
      {t("GRAPH.TITLE.DAYS")}
    </div>
  );
};

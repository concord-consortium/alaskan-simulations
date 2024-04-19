import React from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import { TCaseOutputData } from "../../utils/data";

import css from "./graphs-container.scss";

interface IProps {
  dataOutput: TCaseOutputData;
}

export const GraphsContainer = ({dataOutput}: IProps) => {
  const outputData = dataOutput
;  return (
    <div className={css.graphsContainer}>
      <div className={css.graphs}>
        <Graph title={"ALGAE"} values={outputData.map((data: any) => data.output.algae)} />
        <Graph title={"NITRATE"} values={outputData.map((data: any) => data.output.nitrate)} />
        <Graph title={"TURBIDITY"} values={outputData.map((data: any) => data.output.turbidity)} />
      </div>
    </div>
  );
};

interface IGraphProps {
  title: string;
  values: number[];
}

const Graph = ({title, values}: IGraphProps) => {
  const { t } = useTranslation();

  return (
    <div className={css.graph}>
      <div className={css.graphTitle}>{t(`GRAPHS.LABEL.${title}`)}</div>
      <div className={css.graphContent}>
        {values.map((value: any, idx: number) => {
          return (
            <div key={idx} className={css.graphValue} style={{height: `${value}%`}} />
          );
        })}
      </div>
    </div>
  );
};

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
  const plotSize = {width: 190, height: 75};
  const XAxisLabel = t("GRAPHS.X_AXIS_LABEL");
  const yAxis = [25, 50, 75];
  const yAxisTickLabels = ["High", "Med", "Low"];
  const xAxisTickLabels = ["May", "Jun", "Jul", "Aug", "Sep"];
  const xAxisRange = {min: 20, max: 230};
  const yAxisRange = {min: 0, max: 100};
  const horizontalGridLines = yAxis.map((tick, idx) => {
    const x1 = xAxisRange.min;
    const x2 = xAxisRange.max;
    const y = 15 + 20 * (idx);
    return <line className={css.horizontalLine}  x1={x1} y1={y} x2={x2} y2={y} key={`horizontal-${tick}`} />;
  });

  return (
    <div className={css.graph}>
      <div className={css.graphTitle}>{t(`GRAPHS.LABEL.${title}`)}</div>
      <div className={css.graphContent}>
        <div className={css.yAxisTicks}>
          {yAxisTickLabels.map((tick:string) => {
            return <span key={tick} className={css.yAxisTickLabel}>{tick}</span>;
          })}
        </div>
        <svg className={css.plotSvg} viewBox={`0 0 ${plotSize.width} ${plotSize.height}`}>
          <line className={css.axisLine} x1={xAxisRange.min} y1={65} x2={xAxisRange.max} y2={65} />
          <line className={css.axisLine} x1={20} y1={5} x2={20} y2={65} />
          <g className={css.gridLines}>
            {horizontalGridLines}
          </g>
        </svg>

        <div className={css.xAxisTicks}>
          {xAxisTickLabels.map((tick:string) => {
            return <span key={tick} className={css.xAxisTickLabel}>{tick}</span>;
          })}
        </div>
        <div className={css.xAxisLabel}>
          {XAxisLabel}
        </div>
        {/* {values.map((value: any, idx: number) => {
          return (
            <div key={idx} className={css.graphValue} style={{height: `${value}%`}} />
          );
        })} */}
      </div>
    </div>
  );
};

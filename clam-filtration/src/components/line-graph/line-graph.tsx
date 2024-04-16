import React from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import css from "./line-graph.scss";

export type GraphDatasetStyle = "data1" | "data2";

export interface IXTick {
  val: number | string;
  label: number | string | JSX.Element;
}

export interface IYTick {
  val: number;
  label?: number | string | JSX.Element;
}

export interface ILineGraphProps {
  title: string | JSX.Element;
  data: number[];
  activeXTick?: string | number;
  className: string;
}

export const LineGraph:  React.FC<ILineGraphProps> = (props) => {
  const { t } = useTranslation();
  const xAxisLabel = t("GRAPHS.X_AXIS_LABEL");
  const yMin = 0;
  const yMax = 10;
  const yGridStep = 2;
  const yTicks: IYTick[] = ["EQUALITATIVE_AMOUNT.HIGH", "EQUALITATIVE_AMOUNT.MEDIUM", "EQUALITATIVE_AMOUNT.LOW"].map(val => ({val:100, label: t(`${val}`)}));
  const xTicks: IXTick[] = [`MONTH_1`, `MONTH_2`, `MONTH_3`, `MONTH_4`, `MONTH_5`].map(val => ({val, label: t(`X_${val}`)}));

  const { title, data, activeXTick, className } = props;

  const yRange = yMax - yMin;

  const yLines = [];
  for (let i = yMax; i >= yMin; i -= yGridStep) {
    yLines.push(i);
  }

  return (
    <div className={css.barGraph}>
      <div className={css.title}>{ title }</div>
      <div className={css.mainRow}>
        <div className={css.yTicks}>
          <div className={css.hidden}>
            {
              // yTicks are rendered in the visibility: hidden container to set correct width of the yTicks container.
              // The final yTicks are absolutely positioned, so they're taken out of the layout.
              yTicks.map((tick, index) => (
                <div key={`tick-${index}`} className={css.hidden}>{ tick.label }</div>
              ))
            }
          </div>
          {
            // Final, visible and absolutely positioned yTicks.
            yTicks.map((tick, index) => (
              <div key={`tick-${index}`} className={css.yTick} style={{ bottom: (((tick.val - yMin) / yRange) * 100) + "%" }}>{ tick.label }</div>
            ))
          }
        </div>
        <div className={css.graphAreaContainer}>
          <div className={css.activeXTickContainer}>
            {
              // Active X tick is highlighted only if there's some data to show.
              data.length > 0 && activeXTick !== undefined && xTicks.map((tick, tickIdx) => (
                <div
                  key={tickIdx}
                  className={clsx(css.xTickHighlight, {[css.active]: tick.val === activeXTick })}
                  style={{ width: "24px"}}
                />
              ))
            }
          </div>
          <div className={css.graphArea}>
            <div className={css.yLines}>
            {
              yLines.map((line) => (
                <div key={line} className={clsx(css.yLine, {[css.zero]: line === 0})} style={{ height: `${100 / (yLines.length - 1)}%` }}/>
              ))
            }
            </div>

            <div className={css.data}>
              {
                xTicks.map((tickValue, tickIdx) => {
                  const value = data[tickIdx] ? data[tickIdx] : 0;
                  const height = `${100 * Math.abs(Number(value)) / yRange}%`;
                  return (
                    <div key={tickIdx} className={clsx(css.barGroup)} style={{width: "30px"}}>
                      <div key={tickIdx} className={css[className]} style={{ height }} />
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className={css.xTicks}>
          {
            xTicks.map((tick) => (
              <div
                key={tick.val}
                className={clsx(css.xTick, { [css.active]: data.length > 0 && tick.val === activeXTick })}
                style={{ width: `${100 / xTicks.length}%`}}
              >
                { tick.label }
              </div>
            ))
          }
          </div>
          { xAxisLabel && <div className={css.xAxisLabel}>{ xAxisLabel }</div> }
        </div>
      </div>
    </div>
  );
};

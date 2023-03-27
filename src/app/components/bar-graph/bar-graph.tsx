import React from "react";
import clsx from "clsx";

import css from "./bar-graph.scss";

export type GraphDatasetStyle = "data1" | "data2";

export interface IXTick {
  val: number | string;
  label: number | string | JSX.Element;
}

export interface IYTick {
  val: number;
  label?: number | string | JSX.Element;
}

export interface IBarGraphProps {
  title: string | JSX.Element;
  header: string;
  yAxisLabel: string;
  yMin: number;
  yMax: number;
  yGridStep: number;
  xAxisLabel?: string;
  yTicks: IYTick[];
  xTicks: IXTick[];
  data: (number | Record<string, number>)[][];
  barStyles: GraphDatasetStyle[];
  activeXTick?: string | number;
  onSetActiveXTick?: (tick: string | number) => void;
  timeBased: boolean; //false for plant-lab, true for erosion
  centeredZero?: boolean;
  minorLinesHalfThick?: boolean;
  yAxisLabelHeight?: number;
}

export const BarGraph:  React.FC<IBarGraphProps> = (props) => {
  const { title, header, yAxisLabel, xAxisLabel, yTicks, xTicks, data, barStyles, activeXTick, onSetActiveXTick,
    centeredZero, timeBased, yMin, yMax, yGridStep, minorLinesHalfThick, yAxisLabelHeight } = props;

    console.log("data", data);

  // Length of all the datasets should be the same, so use length of the first one.
  const dataLength = data[0]?.length || 0;

  const yRange = yMax - yMin;

  const yLines = [];
  for (let i = yMax; i >= yMin; i -= yGridStep) {
    yLines.push(i);
  }

  return (
    <div className={css.barGraph}>
      <div className={css.header}>{header}</div>
      <div className={css.title}>{ title }</div>

      <div className={css.mainRow}>
        <div className={css.yAxisLabel} style={yAxisLabelHeight ? {height: yAxisLabelHeight} : undefined}><div>{ yAxisLabel }</div></div>
        <div className={css.yTicks}>
          <div className={css.hidden}>
            {
              // yTicks are rendered in the visibility: hidden container to set correct width of the yTicks container.
              // The final yTicks are absolutely positioned, so they're taken out of the layout.
              yTicks.reverse().map(tick => (
                <div key={tick.val} className={css.hidden}>{ tick.label }</div>
              ))
            }
          </div>
          {
            // Final, visible and absolutely positioned yTicks.
            yTicks.reverse().map(tick => (
              <div key={tick.val} className={css.yTick} style={{ bottom: (((tick.val - yMin) / yRange) * 100) + "%" }}>{ tick.label }</div>
            ))
          }
        </div>
        <div className={css.graphAreaContainer}>
          <div className={css.activeXTickContainer}>
            {
              // Active X tick is highlighted only if there's some data to show.
              dataLength > 0 && activeXTick !== undefined && xTicks.map((tick, tickIdx) => (
                <div
                  key={tickIdx}
                  className={clsx(css.xTickHighlight, { [css.clickable]: onSetActiveXTick && tickIdx < dataLength, [css.active]: tick.val === activeXTick })}
                  onClick={onSetActiveXTick && tickIdx < dataLength ? onSetActiveXTick.bind(null, tick.val) : undefined}
                  style={{ width: `${100 / xTicks.length}%` }}
                />
              ))
            }
          </div>
          <div className={css.graphArea}>
            <div className={css.yLines}>
            {
              yLines.map((line, idx) => (
                <div key={line} className={clsx(css.yLine, {[css.zero]: line === 0, [css.yLineMinor]: idx % 2 === 1 && minorLinesHalfThick })} style={{ height: `${100 / (yLines.length - 1)}%` }}/>
              ))
            }
            </div>

            <div className={clsx(css.data, {[css.centeredZero]: centeredZero})}>
              {
                xTicks.map((tickValue, tickIdx) => (
                  <div key={tickIdx} className={css.barGroup} style={{ width: (timeBased) ?  "30px": "60px"}}>
                    {
                      data.map((dataset, datasetIdx) => {
                        let value = (timeBased === false) ? dataset[activeXTick as number] : dataset[tickIdx];
                        if (typeof value === "object") {
                          value = value[tickValue.val as string];
                        }
                        const width = `${100 / data.length}%`;
                        const height = `${100 * Math.abs(value) / yRange}%`;

                        return (
                          // Don't render bars with height 0, as their border would be visible.
                          value !== undefined && value !== 0
                            ? <div key={datasetIdx} className={clsx(css[barStyles[datasetIdx]], {[css.negative]: value < 0})} style={{ width, height }} />
                            : null
                        );
                      })
                    }
                  </div>
                ))
              }
            </div>
          </div>
          <div className={css.xTicks}>
          {
            xTicks.map((tick, tickIdx) => (
              <div
                key={tick.val}
                className={clsx(css.xTick, { [css.active]: dataLength > 0 && tick.val === activeXTick })}
                style={{ width: `${100 / xTicks.length}%`}}
                onClick={onSetActiveXTick && tickIdx < dataLength ? onSetActiveXTick.bind(null, tick.val) : undefined}
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

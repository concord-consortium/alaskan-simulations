import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "common";
import { TCaseOutputData } from "../../utils/data";

import css from "./graphs-container.scss";

interface IProps {
  dataOutput: TCaseOutputData;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const GraphsContainer = ({dataOutput, time, isRunning, isFinished}: IProps) => {
  return (
    <div className={css.graphsContainer}>
      <div className={css.graphs}>
        <Graph title={"ALGAE"} values={dataOutput.map((data: any) => data.output.algae)} time={time} isRunning={isRunning} isFinished={isFinished}/>
        <Graph title={"NITRATE"} values={dataOutput.map((data: any) => data.output.nitrate)} time={time} isRunning={isRunning} isFinished={isFinished} />
        <Graph title={"TURBIDITY"} values={dataOutput.map((data: any) => data.output.turbidity)} time={time} isRunning={isRunning} isFinished={isFinished}/>
      </div>
    </div>
  );
};

interface IGraphProps {
  title: string;
  values: number[];
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

const Graph = ({title, values, time, isRunning, isFinished}: IGraphProps) => {
  const { t } = useTranslation();
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  useEffect(() => {
    if (time === 0) {
      setCurrentPoints([]);
    }
    if (isFinished) {
      setCurrentPoints(values);
    }
    if (isRunning && !isFinished) {
      const timeIndex = Math.floor(time/2 );
      const maxIndex = Math.min(timeIndex, values.length);
      const newPoints = values.slice(0, maxIndex + 1);
      setCurrentPoints(newPoints);
    }
  }, [time, values, isRunning, isFinished]);

  const plotSize = {width: 190, height: 77};
  const XAxisLabel = t("GRAPHS.X_AXIS_LABEL");
  const yAxis = [25, 45, 65];
  const yAxisTickLabels = ["High", "Med", "Low"];
  const xAxisTickLabels = ["May", "Jun", "Jul", "Aug", "Sep"];
  const xAxisRange = {min: 20, max: 230};
  const yAxisRange = {min: 2, max: 77};
  const horizontalGridLines = yAxis.map((tick, idx) => {
    const x1 = xAxisRange.min;
    const x2 = xAxisRange.max;
    const y = 15 + 25 * (idx);
    return <line className={css.horizontalLine}  x1={x1} y1={y} x2={x2} y2={y} key={`horizontal-${tick}`} />;
  });

  // Normalize the value based on the nitrate scale
  const nitrateScale = { min: 0, max: 55 };
  const nitrateValueToYCoordinate = (value: number) => {
    const normalizedValue = (value - nitrateScale.min) / (nitrateScale.max - nitrateScale.min);
    const svgHeight = yAxisRange.max - yAxisRange.min;
    const yCoord = yAxisRange.max - normalizedValue * svgHeight;
    return yCoord;
  };
  const valueToCoordinate = (value: number, index: number) => {
    const coordinateX = (index * (plotSize.width / values.length)) + xAxisRange.min + 10;
    const coordinateY = title === "NITRATE"
                          ? nitrateValueToYCoordinate(value)
                          : yAxisRange.max - (value * ((yAxisRange.max - yAxisRange.min) / 100));
    return `${coordinateX},${coordinateY}`;
  };

  const plotCoordinates = currentPoints.map(valueToCoordinate).join(" ");
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
          <line className={css.axisLine} x1={xAxisRange.min} y1={yAxisRange.max} x2={xAxisRange.max} y2={yAxisRange.max} />
          <line className={css.axisLine} x1={xAxisRange.min} y1={yAxisRange.min} x2={xAxisRange.min} y2={yAxisRange.max} />
          <g className={css.gridLines}>
            {horizontalGridLines}
          </g>
          <g className={css.plotLine}>
            <polyline className={clsx(css.valueLine, css[`${title.toLowerCase()}`])}
                        points={plotCoordinates} />
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
      </div>
    </div>
  );
};

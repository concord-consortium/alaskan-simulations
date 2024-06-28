import React, { useEffect, useMemo, useState } from "react";
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

type IconPoint = {
  x: number;
  y: number;
  polylineX: number;
  polylineY: number;
  polylinePoint: string;
}

const kPlotWidth = 190;
const kPlotHeight = 80;
const kXRangeOffset = 10;
const kXMin = 20;
const kYMin = 0;
const kMaxTime = 8;
const kScaleBuffer = 10;  //Adds buffer to scale so graph line doesn't hit the top edge of the graph

const Graph = ({title, values, time, isRunning, isFinished}: IGraphProps) => {
  const { t } = useTranslation();
  const [currentPoints, setCurrentPoints] = useState<IconPoint[]>([]);
  const plotSize = {width: kPlotWidth, height: kPlotHeight};
  const xAxisLabel = t("GRAPHS.X_AXIS_LABEL");
  const yAxis = [25, 45, 65];
  const yAxisTickLabels = [t("AMOUNT.HIGH"), t("AMOUNT.MEDIUM"), t("AMOUNT.LOW")];
  const xAxisTickLabels = [t("GRAPHS_MONTH_1"), t("GRAPHS_MONTH_2"), t("GRAPHS_MONTH_3"), t("GRAPHS_MONTH_4"), t("GRAPHS_MONTH_5")];
  const xAxisRange = {min: kXMin, max: kXMin + kPlotWidth};
  const yAxisRange = {min: kYMin, max: kPlotHeight};

  // when the inputs change recompute the graph items
  const {pointsToUse} = useMemo(() => {
    // Normalize the value based on the nitrate scale
    const nitrateScale = { min: 0, max: 60 };
    const nitrateValueToYCoordinate = (value: number) => {
      const normalizedValue = (value - nitrateScale.min) / (nitrateScale.max - nitrateScale.min);
      const svgHeight = yAxisRange.max - yAxisRange.min;
      const yCoord = yAxisRange.max - normalizedValue * svgHeight;
      return yCoord;
    };

    const valueToCoordinate = (value: number, index: number) => {
      const coordinateX = (index * (kPlotWidth / values.length)) + xAxisRange.min + kXRangeOffset;
      const coordinateY = title === "NITRATE"
                            ? nitrateValueToYCoordinate(value)
                            : yAxisRange.max - (value * ((yAxisRange.max - yAxisRange.min) / (100 + kScaleBuffer)));
      return {coordinateX, coordinateY};
    };

    // first get all the defined points
    const definedPoints: IconPoint[] = [];
    values.forEach((val: number, idx: number) => {
      const polylineCoords = valueToCoordinate(val, idx);
      const polylineX = polylineCoords.coordinateX;
      const polylineY = polylineCoords.coordinateY;
      definedPoints.push({x: idx, y: val, polylineX, polylineY, polylinePoint: `${polylineX}, ${polylineY}`});
    });
    // then generate all the interpolated points
    const interpolatedPoints: IconPoint[] = [];
    for (let i = 0; i < definedPoints.length - 1; i++) {
      const start = definedPoints[i];
      const end = definedPoints[i + 1];
      const dx = end.polylineX - start.polylineX;
      const slope = (end.polylineY - start.polylineY) / dx;

      for (let x = start.polylineX; x <= end.polylineX; x++) {
        const y = start.polylineY + slope * (x - start.polylineX);
        interpolatedPoints.push({ x, y, polylineX: x, polylineY: y, polylinePoint: `${x},${y}`});
      }
    }
    return {pointsToUse: interpolatedPoints};
  }, [title, values, xAxisRange.min, yAxisRange.max, yAxisRange.min]);

  useEffect(() => {
    if (time === 0) {
      setCurrentPoints([pointsToUse[0]]);
    }
    if ((isRunning && !isFinished) || (isFinished)) {
      const timeIndex = Math.round(time * (pointsToUse.length / kMaxTime));
      const newPoints = pointsToUse.slice(0, timeIndex);
      setCurrentPoints(newPoints);
    }
  }, [time, pointsToUse, isRunning, isFinished]);


  const horizontalGridLines = yAxis.map((tick, idx) => {
    const x1 = xAxisRange.min;
    const x2 = xAxisRange.max;
    const y = 15 + 25 * (idx);
    return <line className={css.horizontalLine}  x1={x1} y1={y} x2={x2} y2={y} key={`horizontal-${tick}`} />;
  });

  const plotCoordinates = currentPoints.map(p => p.polylinePoint).join(" ");
  const circleCoordinate = pointsToUse[0];
  return (
    <div className={css.graph}>
      <div className={css.graphTitle}>{t(`GRAPHS.LABEL.${title}`)}</div>
      <div className={css.graphContent}>
        <div className={css.yAxisTicks}>
          {yAxisTickLabels.map((tick: React.JSX.Element, index) => {
            return <span key={`yAxisLabel-${index}`} className={css.yAxisTickLabel}>{tick}</span>;
          })}
        </div>
        <svg className={css.plotSvg} viewBox={`0 0 ${plotSize.width} ${plotSize.height}`}>
          <line className={css.axisLine} x1={xAxisRange.min} y1={yAxisRange.max} x2={xAxisRange.max} y2={yAxisRange.max} />
          <line className={css.axisLine} x1={xAxisRange.min} y1={yAxisRange.min} x2={xAxisRange.min} y2={yAxisRange.max} />
          <g className={css.gridLines}>
            {horizontalGridLines}
          </g>
          <g className={css.plotLine}>
            { time < 1 && <circle cx={circleCoordinate.x} cy={circleCoordinate.y} r="1" className={clsx(css.valueStartingPoint, css[`${title.toLowerCase()}`])} />}
            <polyline className={clsx(css.valueLine, css[`${title.toLowerCase()}`])}
                        points={plotCoordinates} />
          </g>
        </svg>
        <div className={css.xAxisTicks}>
          {xAxisTickLabels.map((tick: React.JSX.Element, index) => {
            return <span key={`xAxisLabel-${index}`} className={css.xAxisTickLabel}>{tick}</span>;
          })}
        </div>
        <div className={css.xAxisLabel}>
          {xAxisLabel}
        </div>
      </div>
    </div>
  );
};

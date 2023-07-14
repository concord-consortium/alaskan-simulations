import React, { useState } from "react";
import LocationSymbol from "../assets/location-symbol.svg";
import { DraggableWrapper } from "./draggable-wrapper";

import css from "./route-container.scss";

const pointA = {x: 10, y: 80};
const pointC = {x: 200, y: 80};
const mapHeight = 150;
const mapWidth = 210;

interface LineProps {
  x1: number, y1: number, x2: number, y2: number
}

export const RouteContainer: React.FC = () => {
  const [pointB, setPointB] = useState<{x: number, y: number}>({x: 105, y: 80});

  const handleDragMove = (e: any) => {
    const x = pointB.x + e.movementX;
    const y = pointB.y + e.movementY;
    const yInRange = y >= 1 && y <= mapHeight;
    const xInRange = x >= 1 && x <= mapWidth;

    if (yInRange && xInRange) {
      setPointB({
        x: pointB.x + e.movementX,
        y: pointB.y + e.movementY
      });
    }
  };


  const getAngle = (hypLength: number, whichAngle: "angle1" | "angle2") => {
    const convertToDegrees = (num: number) => Math.round((num) * 180/Math.PI);
    const otherSideLength = whichAngle === "angle1" ? pointB.x - pointA.x : pointC.x - pointB.x;
    const angle = convertToDegrees(whichAngle === "angle1" ? Math.acos(otherSideLength / hypLength) : Math.asin(otherSideLength / hypLength));
    let angleInDegrees: number;
    if (whichAngle === "angle1") {
      angleInDegrees = pointB.y > pointA.y ? 90 + angle : angleInDegrees = 90 - angle;
    } else {
      angleInDegrees = pointB.y < pointC.y ? 180 - angle : angle;
    }
    return angleInDegrees;
  }

  const makeLine = (coords: LineProps) => {
    const {x1, y1, x2, y2} = coords;
    return (
      <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "black", strokeWidth: 2}}/>
    );
  };

  const makeLineWithTextAndAngle = (coords: LineProps, whichAngle: "angle1" | "angle2") => {
    const {x1, y1, x2, y2} = coords;
    const length = Math.round(Math.sqrt((Math.pow((x2 - x1), 2)) + (Math.pow((y2 - y1), 2))));
    const txtPos = {x: (x2+x1) / 2, y: ((y2+y1) / 2)}
    return (
      <>
        {makeLine(coords)}
        <text x={txtPos.x} y={txtPos.y + 15} style={{stroke: "black", textAnchor: "middle", dominantBaseline:"middle"}}>{length}</text>
        <text x={x1 + 20} y={txtPos.y - 15} style={{stroke: "black", textAnchor: "middle", dominantBaseline:"middle"}}>{getAngle(length, whichAngle)}</text>
      </>
    );
  };

  return (
    <div className={css.rightPanelContainer}>
      <div className={css.mapRouteContainer}>
        <div className={css.mapBackground}/>
        <div className={css.svgContainer}>
          <svg height={mapHeight} width={mapWidth}>
            {makeLine({x1: pointA.x, y1: 1, x2: pointA.x, y2: 149})}
            {makeLineWithTextAndAngle({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y}, "angle1")}
            {makeLine({x1: pointB.x, y1: 1, x2: pointB.x, y2: 149})}
            {makeLineWithTextAndAngle({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y}, "angle2")}
          </svg>
          <div className={css.draggableIcon}>
            <DraggableWrapper onDragMove={handleDragMove}>
              <div style={{transform: `translateX(${pointB.x - 15}px) translateY(${pointB.y - 30}px)`}}>
                <LocationSymbol/>
              </div>
            </DraggableWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

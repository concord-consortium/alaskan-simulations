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

const angle1 = "angle1";
const angle2 = "angle2";
type WhichAngle = typeof angle1 | typeof angle2;

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

  const convertRadiansToDegrees = (rad: number) => {
    return Math.round((rad) * 180/Math.PI);
  }


  const getAngle = (hypLength: number, isFirstAngle: boolean) => {
    const otherSideLength = isFirstAngle ? pointB.x - pointA.x : pointC.x - pointB.x;
    const angleInRadians = isFirstAngle ? Math.acos(otherSideLength / hypLength) : Math.asin(otherSideLength / hypLength);
    const angleInDegrees = convertRadiansToDegrees(angleInRadians);
    let finalAngle: number;
    if (isFirstAngle) {
      finalAngle = pointB.y > pointA.y ? 90 + angleInDegrees : 90 - angleInDegrees;
    } else {
      finalAngle = pointB.y < pointC.y ? 180 - angleInDegrees : angleInDegrees;
    }
    return finalAngle;
  }

  const makeLine = (coords: LineProps) => {
    const {x1, y1, x2, y2} = coords;
    return (
      <line x1={x1} y1={y1} x2={x2} y2={y2} style={{stroke: "black", strokeWidth: 2}}/>
    );
  };

  const makeLineWithTextAndAngle = (coords: LineProps, whichAngle: WhichAngle) => {
    const {x1, y1, x2, y2} = coords;
    const length = (Math.sqrt((Math.pow((x2 - x1), 2)) + (Math.pow((y2 - y1), 2))));
    const middleOfLine = {x: (x2+x1) / 2, y: ((y2+y1) / 2)}

    const angle = getAngle(length, whichAngle === angle1);
    const radius = ((x2-x1) * .75) > 70 ? 70 : (x2-x1) * .75;
    const degTxtXPos = radius === 50 ? x1 + 50 : middleOfLine.x;
    const clipPath = whichAngle === angle1 ? "cut-off-left" : "cut-off-right";

    return (
      <>
      { /* create a polygon to clip the circle to only the parts we want to see */ }
      <defs>
        <clipPath id={clipPath}>
          <polygon points={`${x1+1},${y1-1} ${x1 + 1},0 ${x2 + 1},0 ${x2},${y2} `}/>
        </clipPath>
      </defs>
        {makeLine(coords)}
        <text x={middleOfLine.x} y={middleOfLine.y + 15} style={{stroke: "black", textAnchor: "middle", dominantBaseline:"middle"}}>{Math.round(length)}</text>
        <circle r={radius} clipPath={`url(#${clipPath})`} cx={x1} cy={y1} className={css.angle}/>
        <text x={degTxtXPos} y={middleOfLine.y - 15} style={{stroke: "black", textAnchor: "middle", dominantBaseline:"middle"}}>{angle}°</text>
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
            {makeLineWithTextAndAngle({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y}, angle1)}
            {makeLine({x1: pointB.x, y1: 1, x2: pointB.x, y2: 149})}
            {makeLineWithTextAndAngle({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y}, angle2)}
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

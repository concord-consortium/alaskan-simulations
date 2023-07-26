import React, { useEffect, useState, useRef } from "react";
import LocationSymbol from "../../assets/location-symbol.svg";

import css from "./route-map.scss";

/* placeholders for now, these will be determined by final image that has markers for locations */
const pointA = {x: 10, y: 80};
const pointC = {x: 200, y: 80};

const mapWidth = 220;
const mapHeight = 150;

// Don't let users drag to the very edges of the map.
const xDraggingMargin = 40;
const yDraggingMargin = 20;
const allowedDraggingArea = {
  minX: xDraggingMargin,
  maxX: mapWidth - xDraggingMargin,
  minY: yDraggingMargin,
  maxY: mapHeight - yDraggingMargin
};

interface LineProps {
  x1: number, y1: number, x2: number, y2: number
}

const angle1 = "angle1";
const angle2 = "angle2";
type WhichAngle = typeof angle1 | typeof angle2;

export const RouteMap: React.FC = () => {
  const [pointB, setPointB] = useState<{x: number, y: number}>({x: 105, y: 80});
  const [isDragging, setIsDragging] = useState(false);
  const draggingOffset = useRef<{x: number, y: number}>({x: 0, y: 0});
  const draggingContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      let { x, y } = getRelativeCoords(e);
      x = x - draggingOffset.current.x;
      y = y - draggingOffset.current.y;
      x = Math.max(allowedDraggingArea.minX, Math.min(allowedDraggingArea.maxX, x));
      y = Math.max(allowedDraggingArea.minY, Math.min(allowedDraggingArea.maxY, y));
      setPointB({ x, y });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);
    }
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isDragging]);

  const getRelativeCoords = (e: PointerEvent | React.PointerEvent) => {
    const { x: containerX, y: containerY } = draggingContainerRef.current?.getBoundingClientRect() || { x: 0, y: 0};
    const x = e.clientX - containerX;
    const y = e.clientY - containerY;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = getRelativeCoords(e);
    draggingOffset.current = { x: x - pointB.x, y: y - pointB.y };
    setIsDragging(true);
   };

  const convertRadiansToDegrees = (rad: number) => {
    return Math.round((rad) * 180/Math.PI);
  };

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
  };

  const makeLine = (coords: LineProps, className: string) => {
    const {x1, y1, x2, y2} = coords;
    return (
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={css[className]}/>
    );
  };

  const makePointLabel = (point: "A" | "B" | "C") => {
    const pointData = point === "A" ? pointA : point === "B" ? pointB : pointC;
    const yOffset = 15;
    return (
      <text x={pointData.x} y={pointData.y + yOffset} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.pointLabel}>{point}</text>
    );
  };

  const makeLineWithTextAndAngle = (coords: LineProps, whichAngle: WhichAngle) => {
    const {x1, y1, x2, y2} = coords;

    const length = (Math.sqrt((Math.pow((x2 - x1), 2)) + (Math.pow((y2 - y1), 2))));
    const middleOfLine = {x: (x2+x1) / 2, y: ((y2+y1) / 2)};
    const angle = getAngle(length, whichAngle === angle1);
    /* set maxRadius, otherwise circle could be too large */
    const maxRadius = 70;
    const radius = ((length) * .75) > maxRadius ? maxRadius : (length) * .75;
    const clipPath = whichAngle === angle1 ? "cut-off-left" : "cut-off-right";

    const degTxtXPos = radius === maxRadius ? x1 + maxRadius : middleOfLine.x;
    /* position text above or below route line */
    const yOffset = 15;

    return (
      <>
      { /* create a polygon to clip the circle to only the parts we want to see */ }
      <defs>
        <clipPath id={clipPath}>
          <polygon points={`${x1+1},${y1-1} ${x1 + 1},0 ${x2 + 1},0 ${x2},${y2-1}`}/>
        </clipPath>
      </defs>
        {makeLine(coords, "routeLine")}
        <text x={x1} y={y1} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.pointLabel}></text>
        <text x={middleOfLine.x} y={middleOfLine.y + yOffset} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.mapText}>{Math.round(length)}mi</text>
        <circle r={radius} clipPath={`url(#${clipPath})`} cx={x1} cy={y1} className={css.angle}/>
        <text x={degTxtXPos} y={middleOfLine.y - yOffset} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.mapText}>{angle}°</text>
      </>
    );
  };

  /* offset location icon by half its width and height so the bottom of it is aligned with point b*/
  const locIconXOffset = pointB.x - 15;
  const locIconYOffset = pointB.y - 32;

  return (
    <div className={css.mapRouteContainer} ref={draggingContainerRef}>
      <div className={css.mapBackground}/>
      <div className={css.svgContainer}>
        <svg height={mapHeight} width={mapWidth}>
          {makeLine({x1: pointA.x, y1: 0, x2: pointA.x, y2: mapHeight}, "vertical")}
          {makeLineWithTextAndAngle({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y}, angle1)}
          {makeLine({x1: pointB.x, y1: 0, x2: pointB.x, y2: mapHeight}, "vertical")}
          {makeLineWithTextAndAngle({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y}, angle2)}
          {makePointLabel("A")}
          {makePointLabel("B")}
          {makePointLabel("C")}
        </svg>
        <div
          className={css.draggableIcon}
          style={{
            transform: `translateX(${locIconXOffset}px) translateY(${locIconYOffset}px)`,
            cursor: isDragging ? "grabbing" : "grab"
          }}
          onPointerDown={handlePointerDown}
        >
          <LocationSymbol/>
        </div>
      </div>
    </div>
  );
};

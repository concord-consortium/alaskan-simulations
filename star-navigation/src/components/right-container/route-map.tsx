import React, { useEffect, useState, useRef, useCallback } from "react";
import { roundToNearest5 } from "../../utils/sim-utils";
import LocationSymbol from "../../assets/location-symbol.svg";

import css from "./route-map.scss";

/* placeholders for now, these will be determined by final image that has markers for locations */
export const pointA = {x: 30, y: 105};
export const pointC = {x: 185, y: 105};

const mapWidth = 220;
const mapHeight = 150;

// The real distance between point A and point C is 17 miles.
const pixelToMileRatio = 17 / (pointC.x - pointA.x);
const travelSpeed = 10; // miles per hour, snowmobile speed

// Don't let users drag to the very edges of the map.
const xDraggingMargin = 10;
const yDraggingMargin = 20;
const allowedDraggingArea = {
  minX: pointA.x + xDraggingMargin,
  maxX: pointC.x - xDraggingMargin,
  minY: yDraggingMargin,
  maxY: mapHeight - yDraggingMargin
};

const radToDeg = (rad: number) => {
  return rad * 180 / Math.PI;
};

const degToRad = (deg: number) => {
  return deg * Math.PI / 180;
};

const rotatePoint = (point: { x: number, y: number }, angle: number) => {
  angle = -1 * angle; // to rotate clockwise
  const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
  const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
  return { x, y };
};

interface LineProps {
  x1: number, y1: number, x2: number, y2: number
}

const angle1 = "angle1";
const angle2 = "angle2";
type WhichAngle = typeof angle1 | typeof angle2;

interface IProps {
  pointB: { x: number, y: number };
  onPointBChange: (pointB: { x: number, y: number }) => void;
  showUserTrip: boolean;
  AtoBHeading?: number;
  AtoBDuration?: number;
  BtoCHeading?: number;
  BtoCDuration?: number;
}

export const RouteMap: React.FC<IProps> = ({ pointB, onPointBChange, showUserTrip, AtoBHeading, AtoBDuration, BtoCHeading, BtoCDuration }) => {
  const [isDragging, setIsDragging] = useState(false);
  const draggingOffset = useRef<{x: number, y: number}>({x: 0, y: 0});
  const draggingContainerRef = useRef<HTMLDivElement>(null);

  let realPointB, realPointC;
  if (showUserTrip && AtoBHeading !== undefined && AtoBDuration !== undefined && BtoCHeading !== undefined && BtoCDuration !== undefined) {
    const realAtoBLength = AtoBDuration * travelSpeed / pixelToMileRatio;
    const realAtoBOffset = rotatePoint({ x: 0, y: realAtoBLength }, degToRad(AtoBHeading));
    realPointB = { x: pointA.x + realAtoBOffset.x, y: pointA.y - realAtoBOffset.y };

    const realBtoCLength = BtoCDuration * travelSpeed / pixelToMileRatio;
    const realBtoCOffset = rotatePoint({ x: 0, y: realBtoCLength }, degToRad(BtoCHeading));
    realPointC = { x: realPointB.x + realBtoCOffset.x, y: realPointB.y - realBtoCOffset.y };
  }

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = getRelativeCoords(e);
    draggingOffset.current = { x: x - pointB.x, y: y - pointB.y };
    setIsDragging(true);
  }, [pointB.x, pointB.y]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const cancelNativeScroll = useCallback((e: React.TouchEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  // Prevent scrolling when user touches the map on iPad. It's likely that they want to drag the point instead.
  // Native scrolling is distracting and makes it harder to drag the point. It's necessary to use native events
  // because calling preventDefault() on React's synthetic events won't prevent scrolling.
  useEffect(() => {
    const container = draggingContainerRef.current;
    container?.addEventListener("touchmove", cancelNativeScroll);
    return () => {
      container?.removeEventListener("touchmove", cancelNativeScroll);
    };
  }, [cancelNativeScroll]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      let { x, y } = getRelativeCoords(e);
      x = x - draggingOffset.current.x;
      y = y - draggingOffset.current.y;
      x = Math.max(allowedDraggingArea.minX, Math.min(allowedDraggingArea.maxX, x));
      y = Math.max(allowedDraggingArea.minY, Math.min(allowedDraggingArea.maxY, y));

      let BACAngle = getBACAngle(x, y);
      let BCAAngle = getBCAAngle(x, y);
      BACAngle = roundToNearest5(BACAngle);
      BCAAngle = roundToNearest5(BCAAngle);
      const newCoords = findBCoordsForGivenAngles(BACAngle, BCAAngle);

      if (!newCoords) {
        // If the angles are 0, just keep user's selected X value.
        onPointBChange({ x, y: pointC.y });
      } else {
        const { x: xRelative, y: yRelative } = newCoords;
        if (y < pointA.y) {
          onPointBChange({ x: pointA.x + xRelative, y: pointA.y - yRelative });
        } else {
          onPointBChange({ x: pointA.x + xRelative, y: pointA.y + yRelative });
        }
      }
    };

    if (isDragging) {
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);
    }
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerUp, isDragging, onPointBChange]);

  const getRelativeCoords = (e: PointerEvent | React.PointerEvent) => {
    const { x: containerX, y: containerY } = draggingContainerRef.current?.getBoundingClientRect() || { x: 0, y: 0 };
    const x = e.clientX - containerX;
    const y = e.clientY - containerY;
    return { x, y };
  };

  const getBACAngle = (xb: number, yb: number) => {
    return radToDeg(Math.atan2(Math.abs(yb - pointA.y), xb - pointA.x));
  };

  const getBCAAngle = (xb: number, yb: number) => {
    return radToDeg(Math.atan2(Math.abs(yb - pointC.y), pointC.x - xb));
  };

  const findBCoordsForGivenAngles = (BACAngleInDeg: number, BCAAngleInDeg: number) => {
    // This function finds a B position for a ABC triangle when the angles BAC and BCA are known.
    // Note that it assumes that point A lays at (0, 0). Equations below are results of trigonometry and solving
    // a system of two equations on a piece of paper.
    // Result is returned as an object with x and y coordinates of point B, relative to point A = (0, 0).
    if (BACAngleInDeg === 0 || BCAAngleInDeg === 0) {
      // Not really a triangle when one of the angles is 0.
      return null;
    }
    const BACAngle = degToRad(BACAngleInDeg);
    const BCAAngle = degToRad(BCAAngleInDeg);
    const x = Math.tan(BCAAngle) * (pointC.x - pointA.x) / (Math.tan(BACAngle) + Math.tan(BCAAngle));
    const y = Math.tan(BACAngle) * x;
    return { x, y };
  };

  const getAngle = (hypLength: number, isFirstAngle: boolean) => {
    const otherSideLength = isFirstAngle ? pointB.x - pointA.x : pointC.x - pointB.x;
    const angleInRadians = isFirstAngle ? Math.acos(otherSideLength / hypLength) : Math.asin(otherSideLength / hypLength);
    const angleInDegrees = Math.round(radToDeg(angleInRadians));
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
    const lengthInMiles = (length * pixelToMileRatio).toFixed(1);
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
        <text x={middleOfLine.x} y={middleOfLine.y + yOffset} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.mapText}>{lengthInMiles}mi</text>
        <circle r={radius} clipPath={`url(#${clipPath})`} cx={x1} cy={y1} className={css.angle}/>
        <text x={degTxtXPos} y={middleOfLine.y - yOffset} style={{textAnchor: "middle", dominantBaseline:"middle"}} className={css.mapText}>{angle}°</text>
      </>
    );
  };

  return (
    <div className={css.mapRouteContainer} ref={draggingContainerRef}>
      <div className={css.svgContainer}>
        <svg height={mapHeight} width={mapWidth}>
          {makeLine({x1: pointA.x, y1: 0, x2: pointA.x, y2: mapHeight}, "vertical")}
          {makeLineWithTextAndAngle({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y}, angle1)}
          {makeLine({x1: pointB.x, y1: 0, x2: pointB.x, y2: mapHeight}, "vertical")}
          {makeLineWithTextAndAngle({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y}, angle2)}
          {makePointLabel("A")}
          {makePointLabel("B")}
          {makePointLabel("C")}
          {
            showUserTrip && realPointB &&
            makeLine({ x1: pointA.x, y1: pointA.y, x2: realPointB.x, y2: realPointB.y }, "realRouteLine")
          }
          {
            showUserTrip && realPointB && realPointC &&
            makeLine({ x1: realPointB.x, y1: realPointB.y, x2: realPointC.x, y2: realPointC.y }, "realRouteLine")
          }
        </svg>
        <div
          className={css.draggableIcon}
          style={{
            transform: `translateX(${pointB.x}px) translateY(${pointB.y}px)`,
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

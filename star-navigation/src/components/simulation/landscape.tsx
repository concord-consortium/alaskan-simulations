import React, { useEffect, useRef, useState } from "react";
import { getHorizontalFov } from "../../utils/sim-utils";
import { config } from "../../config";
import LandscapeImg from "../../assets/CC_Constellation_environment_230711.png";
import LandscapeImgWithMarkers from "../../assets/CC_Constellation_environment_230711_with_markers.png";
import { clsx } from "clsx";

import css from "./landscape.scss";

const landscapeFullAngle = 360; // degrees
const handToDegree = 10; // one hand image represents 10 degrees
const handAspectRatio = 96 / 80; // based on the hand image dimensions

const LandscapeFragment = () => {
  // When freeCamera is used, use image with N/S/W/E markers for debugging/dev purposes.
  const Image = config.freeCamera ? LandscapeImgWithMarkers : LandscapeImg;
  return (
    <div className={css.landscapeFragment}>
      <img src={Image} />
    </div>
  );
};

interface IHandProps {
  starViewHorizontalFov: number;
  angle: number;
  handSize: number;
  left: boolean;
}

const Hands: React.FC<IHandProps> = ({ starViewHorizontalFov, angle, handSize, left }) => {
  const width = `${100 * angle / (starViewHorizontalFov * 0.5)}%`;
  const height = handAspectRatio * handSize;
  return (
    <div className={clsx(css.hands, {[css.left]: left })} style={{ width, height, backgroundSize: handSize }}/>
  );
};

interface IProps {
  aspectRatio: number;
  realHeadingFromNorth: number;
  headingFromAssumedNorthStar?: number;
}

export const Landscape: React.FC<IProps> = ({ aspectRatio, realHeadingFromNorth, headingFromAssumedNorthStar }) => {
  const [ containerWidth, setContainerWidth ] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  const starViewHorizontalFov = getHorizontalFov(config.horizonFov, aspectRatio);

  const scale = landscapeFullAngle / starViewHorizontalFov;
  const finalLandscapeImgWidth = containerWidth * scale;
  const degreeToPixel = finalLandscapeImgWidth / landscapeFullAngle;
  // -1.5 to center the container at the middle of the middle image.
  const marginLeft = -1.5 * finalLandscapeImgWidth + 0.5 * containerWidth;
  const left = degreeToPixel * -realHeadingFromNorth;

  // finalLandscapeImgWidth might be NaN because of 0 division when things are still loading.
  const positionStyles = !isNaN(finalLandscapeImgWidth) ? {
    width: finalLandscapeImgWidth,
    marginLeft,
    left
  } : undefined;


  let handsAngleValue = headingFromAssumedNorthStar ?? 0;
  let leftHandOrientation = false;
  if (handsAngleValue < 180) {
    leftHandOrientation = true;
  }
  handsAngleValue = handsAngleValue > 180 ? 360 - handsAngleValue : handsAngleValue;
  const overflowHandsAngle = Math.max(0, handsAngleValue - 360 + 0.5 * starViewHorizontalFov);

  const handSize = handToDegree * degreeToPixel;

  return (
    <div ref={containerRef} className={css.landscape}>
      <div className={css.imageContainer} style={positionStyles}>
        {/* There are 3 full, repeated landscapes so we don't have to worry about wrapping when user makes a full 360 loop */}
        <LandscapeFragment />
        <LandscapeFragment />
        <LandscapeFragment />
      </div>
      {
        handsAngleValue !== undefined && !isNaN(handSize) &&
        <>
          <div className={clsx(css.handsContainer, {[css.left]: leftHandOrientation })}>
            <Hands
              starViewHorizontalFov={starViewHorizontalFov}
              angle={handsAngleValue}
              handSize={handSize}
              left={leftHandOrientation}
            />
          </div>
          <div className={css.handsContainer}>
            <Hands
              starViewHorizontalFov={starViewHorizontalFov}
              angle={overflowHandsAngle}
              handSize={handSize}
              left={leftHandOrientation}
            />
          </div>
        </>
      }
    </div>
  );
};

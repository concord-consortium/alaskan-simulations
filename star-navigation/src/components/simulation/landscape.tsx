import React, { useEffect, useRef, useState } from "react";
import { getHorizontalFov } from "../../utils/sim-utils";
import { config } from "../../config";
import LandscapeImg from "../../assets/CC_Constellation_environment_230711.png";
import LandscapeImgWithMarkers from "../../assets/CC_Constellation_environment_230711_with_markers.png";

import css from "./landscape.scss";

interface IProps {
  aspectRatio: number;
  realHeadingFromNorth: number;
}

const landscapeFullAngle = 360; // degrees

export const Landscape: React.FC<IProps> = ({ aspectRatio, realHeadingFromNorth }) => {
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

  // When freeCamera is used, use image with N/S/W/E markers for debugging/dev purposes.
  const Image = config.freeCamera ? LandscapeImgWithMarkers : LandscapeImg;

  // finalLandscapeImgWidth might be NaN because of 0 division when things are still loading.
  const imageContainerStyle = !isNaN(finalLandscapeImgWidth) ? {
    width: finalLandscapeImgWidth,
    marginLeft,
    left
  } : undefined;

  return (
    <div ref={containerRef} className={css.landscape}>
      <div className={css.imageContainer} style={imageContainerStyle}>
        {/* There are 3 images so we don't have to worry about wrapping when user makes a full 360 loop */}
        <img src={Image} />
        <img src={Image} />
        <img src={Image} />
      </div>
    </div>
  );
};

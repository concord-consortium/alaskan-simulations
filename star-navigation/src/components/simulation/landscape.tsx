import React, { useEffect, useRef, useState } from "react";
import { getHorizontalFov } from "../../utils/sim-utils";
import { config } from "../../config";
import { Hands } from "./hands";
import LandscapeImg from "../../assets/CC_Constellation_environment_230711.png";
import LandscapeImgWithMarkers from "../../assets/CC_Constellation_environment_230711_with_markers.png";

import css from "./landscape.scss";

const landscapeFullAngle = 360; // degrees

interface ILandscapeFragmentProps {
  northMarkerOffset?: number;
  degreeToPixel: number;
}

const LandscapeFragment: React.FC<ILandscapeFragmentProps> = ({ northMarkerOffset, degreeToPixel }) => {
  // When freeCamera is used, use image with N/S/W/E markers for debugging/dev purposes.
  const Image = config.freeCamera ? LandscapeImgWithMarkers : LandscapeImg;

  const compassMarkers = config.landscapeMarkers && northMarkerOffset !== undefined ? [
    { label: "N", offset: northMarkerOffset * degreeToPixel },
    { label: "E", offset: (northMarkerOffset + 90) * degreeToPixel },
    { label: "S", offset: (northMarkerOffset + 180) * degreeToPixel },
    { label: "W", offset: (northMarkerOffset - 90) * degreeToPixel },
  ] : [];

  return (
    <div className={css.landscapeFragment}>
      <img src={Image} />
      {
        compassMarkers.map(({ label, offset }) => (
          <div key={label} className={css.marker} style={{ transform: `translate(${offset}px)` }}>
            <div className={css.label}>{ label }</div>
          </div>
        ))
      }
    </div>
  );
};

interface IProps {
  aspectRatio: number;
  realHeadingFromNorth: number;
  headingFromAssumedNorthStar?: number;
}

export const Landscape: React.FC<IProps> = ({ aspectRatio, realHeadingFromNorth, headingFromAssumedNorthStar }) => {
  const [containerWidth, setContainerWidth] = useState(0);
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

  const northMarkerOffset =
    headingFromAssumedNorthStar !== undefined ? (realHeadingFromNorth - headingFromAssumedNorthStar) : undefined;

  return (
    <div ref={containerRef} className={css.landscape}>
      <div className={css.imageContainer} style={positionStyles}>
        {/* There are 3 full, repeated landscapes so we don't have to worry about wrapping when user makes a full 360 loop */}
        <LandscapeFragment northMarkerOffset={northMarkerOffset} degreeToPixel={degreeToPixel} />
        <LandscapeFragment northMarkerOffset={northMarkerOffset} degreeToPixel={degreeToPixel} />
        <LandscapeFragment northMarkerOffset={northMarkerOffset} degreeToPixel={degreeToPixel} />
      </div>
      <Hands
        headingFromAssumedNorthStar={headingFromAssumedNorthStar}
        degreeToPixel={degreeToPixel}
        starViewHorizontalFov={starViewHorizontalFov}
      />
    </div>
  );
};

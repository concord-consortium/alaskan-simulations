import React from "react";
import { Stars } from "./stars";
import { WesternConstellations } from "./western-constellations";
import { YupikConstellations } from "./yupik-constallations";
import { InteractiveStars } from "./interactive-stars";

interface IProps {
  rotation: [number, number, number];
  radius: number;
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
  onStarClick: (starHip: number) => void;
  compassInteractionActive: boolean;
}

export const CelestialSphere: React.FC<IProps> = (props) => {
  const { rotation, radius, showWesternConstellations, showYupikConstellations, onStarClick, compassInteractionActive } = props;

  return (
    <object3D rotation={rotation}>
      <Stars radius={radius} />
      {
        showWesternConstellations &&
        <WesternConstellations radius={radius} />
      }
      {
        showYupikConstellations &&
        <YupikConstellations radius={radius * 1.1} />
      }
      {
        compassInteractionActive &&
        <InteractiveStars radius={radius * 1.2} onStarClick={onStarClick} />
      }
    </object3D>
  );
};

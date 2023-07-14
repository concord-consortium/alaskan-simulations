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
  compassActive: boolean;
}

export const CelestialSphere: React.FC<IProps> = (props) => {
  const { rotation, radius, showWesternConstellations, showYupikConstellations, onStarClick, compassActive } = props;

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
        compassActive &&
        <InteractiveStars radius={radius * 1.2} onStarClick={onStarClick} />
      }
    </object3D>
  );
};

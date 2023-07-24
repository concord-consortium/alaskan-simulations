import React from "react";
import { Stars } from "./stars";
import { WesternConstellations } from "./western-constellations";
import { YupikConstellations } from "./yupik-constallations";

interface IProps {
  rotation: [number, number, number];
  radius: number;
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
}

export const CelestialSphere: React.FC<IProps> = (props) => {
  const { rotation, radius, showWesternConstellations, showYupikConstellations } = props;

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
    </object3D>
  );
};

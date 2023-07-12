import React from "react";
import * as THREE from "three";
import { Stars } from "./stars";
import { WesternConstellations } from "./western-constellations";
import { toLocalSiderealTime } from "../../utils/time-conversion";
import { localSiderealTimeToCelestialSphereRotation } from "../../utils/sim-utils";
import { YupikConstellations } from "./yupik-constallations";

const CELESTIAL_SPHERE_RADIUS = 1000;

interface IProps {
  epochTime: number;
  lat: number;
  long: number;
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
}

export const CelestialSphere: React.FC<IProps> = ({ epochTime, lat, long, showWesternConstellations, showYupikConstellations }) => {
  const date = new Date(epochTime);
  const lst = toLocalSiderealTime(date, long);
  const rotationY = -1 * localSiderealTimeToCelestialSphereRotation(lst);
  const rotationX = -1 * THREE.MathUtils.degToRad(90 - lat);

  return (
    <object3D rotation={[rotationX, rotationY, 0]}>
      <Stars radius={CELESTIAL_SPHERE_RADIUS} />
      {
        showWesternConstellations &&
        <WesternConstellations radius={CELESTIAL_SPHERE_RADIUS} />
      }
      {
        showYupikConstellations &&
        <YupikConstellations radius={CELESTIAL_SPHERE_RADIUS + 10} />
      }
    </object3D>
  );
};

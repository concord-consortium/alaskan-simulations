import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import stars from "../../data/CEASAR-HYG-for-import-9k.csv";
import constellations from "../../data/constellations.csv";
import { calculateEquatorialPosition } from "../../utils/sim-utils";

interface IProps {
  radius: number;
}

export const WesternConstellations: React.FC<IProps> = ({ radius }) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useLayoutEffect(() => {
    const starById: Record<number, any> = {};
    stars.forEach((star: any) => {
      starById[star.Hip] = star;
    });

    const points: THREE.Vector3[] = [];
    constellations.forEach((constellation: any) => {
      const starIds: number[] = constellation.__parsed_extra;
      starIds.forEach(starId => {
        const star = starById[starId];
        const starPosition = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
        points.push(starPosition);
      });
    });

    geometryRef.current?.setFromPoints(points);
  }, [radius]);

  return (
    <lineSegments>
      <bufferGeometry attach="geometry" ref={geometryRef} />
      <lineBasicMaterial attach="material" color={0x74b9ff} linewidth={1} />
    </lineSegments>
  );
};

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { calculateEquatorialPosition } from "../../utils/sim-utils";
import { config } from "../../config";
import circleImg from "../../assets/circle.png";
import { IStarData  } from "../../types";
import { getConstellationStars, getFilteredStars, isStarInConstellation } from "../../utils/star-utils";

const STAR_SIZES = [1, 2, 3, 4, 5, 6, 7];
const SIZE_POW = 1;
const SIZE_MULT = config.starSizeMult;
const MIN_CONSTELLATION_STAR_SIZE = config.minConstellationStarSize;
const MAX_CONSTELLATION_STAR_SIZE = config.maxConstellationStarSize;
const CONSTELLATION_STAR_SIZE_RANGE = MAX_CONSTELLATION_STAR_SIZE - MIN_CONSTELLATION_STAR_SIZE;

interface MinMax {
  min: number;
  max: number;
}

const getStarsMinAndMaxMagnitude = (stars: IStarData[]): MinMax => {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    if (star.Mag > max) {
      max = star.Mag;
    }
    if (star.Mag < min) {
      min = star.Mag;
    }
  }
  return { min, max };
};

const getRelativeStarMagnitude = (star: IStarData, { min, max }: MinMax) => {
  return (star.Mag - min) / (max - min);
};

interface IStarsGroupProps {
  radius: number;
  starsGroup: IStarData[];
  size: number;
}

export const StarsGroup: React.FC<IStarsGroupProps> = ({ radius, starsGroup, size }) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const circleTexture = useLoader(THREE.TextureLoader, circleImg) as THREE.Texture;

  useLayoutEffect(() => {
    const vertexCount = starsGroup.length;

    const vertices = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      const star = starsGroup[i];
      const vertex = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
      vertices[i * 3] = vertex.x;
      vertices[i * 3 + 1] = vertex.y;
      vertices[i * 3 + 2] = vertex.z;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
    }

    geometryRef.current?.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometryRef.current?.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, [radius, starsGroup]);

  return (
    <points>
      <bufferGeometry attach="geometry" ref={geometryRef} />
      <pointsMaterial
        attach="material"
        size={Math.pow(size, SIZE_POW) * SIZE_MULT}
        map={circleTexture}
        sizeAttenuation={false}
        transparent={true}
        vertexColors={true}
      />
    </points>
  );
};

interface IStarsProps {
  radius: number;
}

export const Stars: React.FC<IStarsProps> = ({ radius }) => {
  const starsBySize = useMemo(() => {
    const stars = getFilteredStars();
    const constellationStars = getConstellationStars();

    const starMag = getStarsMinAndMaxMagnitude(stars);
    const constellationMag = getStarsMinAndMaxMagnitude(constellationStars);

    const result: Record<string, IStarData[]> = {};

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      let size: number;
      if (isStarInConstellation(star.Hip)) {
        const relativeMagnitude = getRelativeStarMagnitude(star, constellationMag);
        size = MIN_CONSTELLATION_STAR_SIZE + (CONSTELLATION_STAR_SIZE_RANGE * relativeMagnitude);
      } else {
        const relativeMagnitude = getRelativeStarMagnitude(star, starMag);
        const sizeIdx = Math.round(relativeMagnitude * (STAR_SIZES.length - 1));
        size = STAR_SIZES[sizeIdx];
      }
      if (result[size] === undefined) {
        result[size] = [];
      }
      result[size].push(star);
    }
    return result;
  }, []);

  return (
    <object3D>
      {
        Object.keys(starsBySize).map((sizeKey: string) =>
          <StarsGroup key={sizeKey} radius={radius} starsGroup={starsBySize[sizeKey]} size={Number(sizeKey)} />
        )
      }
    </object3D>
  );
};

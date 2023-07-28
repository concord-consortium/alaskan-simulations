import React, { useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { calculateEquatorialPosition } from "../../utils/sim-utils";
import { getFilteredStars } from "../../utils/star-utils";

import circleImg from "../../assets/circle.png";

const SPRITE_RENDERING = true;
const SPRITE_SCALE = 0.1;

interface IProps {
  radius: number;
  rotation: [number, number, number];
  onStarClick?: (point: THREE.Vector3, starHip: number) => void;
  onStarPointerDown?: (point: THREE.Vector3, starHip: number) => void;
  onStarPointerUp?: (point: THREE.Vector3, starHip: number) => void;
}

export const InteractiveStars: React.FC<IProps> = ({ radius, rotation, onStarClick, onStarPointerDown, onStarPointerUp }) => {
  const circleTexture = useLoader(THREE.TextureLoader, circleImg) as THREE.Texture;
  const [hovered, setHovered] = useState(-1);

  const stars = useMemo(getFilteredStars, []);

  const rotationEuler = useMemo(() => new THREE.Euler(...rotation), [rotation]);
  const getStarPosition = useCallback((starPosWithoutRotation: THREE.Vector3) => {
    return starPosWithoutRotation.clone().applyEuler(rotationEuler);
  }, [rotationEuler]);

  const starHandlers = useMemo(() => {
    return stars.map(star => ({
      onPointerOver: () => setHovered(star.Hip),
      onPointerOut: () => hovered === star.Hip && setHovered(-1),
      onClick: (event: THREE.Event) => onStarClick?.(getStarPosition(event.object.position), star.Hip),
      onPointerDown: (event: THREE.Event) => onStarPointerDown?.(getStarPosition(event.object.position), star.Hip),
      onPointerUp: (event: THREE.Event) => onStarPointerUp?.(getStarPosition(event.object.position), star.Hip),
    }));
  }, [getStarPosition, hovered, onStarClick, onStarPointerDown, onStarPointerUp, stars]);

  return (
    <object3D rotation={rotation}>
      {
        !SPRITE_RENDERING &&
        stars.map((star, index) => {
          const pos = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
          return (
            <mesh
              key={index}
              position={[pos.x, pos.y, pos.z]}
              onPointerOver={() => setHovered(star.Hip)}
              onPointerOut={() => hovered === star.Hip && setHovered(-1)}
            >
              <sphereGeometry args={[radius * 0.05, 16, 16]} />
              <meshBasicMaterial
                color="yellow"
                transparent={true}
                opacity={hovered === star.Hip ? 0.3 : 0.01}
                depthTest={false}
              />
            </mesh>
          );
        })
      }
      {
        SPRITE_RENDERING &&
        stars.map((star, index) => {
          const pos = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
          return (
            <sprite
              key={index}
              position={[pos.x, pos.y, pos.z]}
              {...starHandlers[index]}
              scale={[SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE]}
            >
              <spriteMaterial
                map={circleTexture}
                transparent={true}
                color="yellow"
                sizeAttenuation={false}
                opacity={hovered === star.Hip ? 0.5 : 0}
              />
            </sprite>
          );
        })
      }
    </object3D>
  );
};

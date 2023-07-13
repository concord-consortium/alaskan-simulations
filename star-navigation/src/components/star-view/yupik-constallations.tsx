import React from "react";
import * as THREE from "three";
import { config } from "../../config";
import { useLoader } from "@react-three/fiber";

interface IProps {
  radius: number;
}

export const YupikConstellations: React.FC<IProps> = ({ radius }) => {
  const constellationTexture = useLoader(THREE.TextureLoader, config.constellations) as THREE.Texture;

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]}/>
      <meshBasicMaterial
        color={0xffffff}
        opacity={config.constellationsOpacity}
        map={constellationTexture}
        map-wrapS={THREE.RepeatWrapping}
        map-repeat-x={-1}
        side={THREE.BackSide}
        transparent={true}
      />
    </mesh>
  );
};

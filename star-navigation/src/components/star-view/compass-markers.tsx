import React from "react";
import * as THREE from "three";
import { useTexture, Line } from "@react-three/drei";

import compassN from "../../assets/compass_icon_selected.png";
import compassS from "../../assets/compass_s.png";
import compassW from "../../assets/compass_w.png";
import compassE from "../../assets/compass_e.png";

const SPRITE_SCALE = 0.0035;
const SPRITE_WIDTH = SPRITE_SCALE * 82; // px
const SPRITE_HEIGHT = SPRITE_SCALE * 98; // px
const COLOR = "yellow";
const SPRITE_CENTER = new THREE.Vector2(0.5, 0.15);

interface IMarkerProps {
  northMarkerTip: [number, number, number];
  direction: "N" | "S" | "W" | "E";
}

const directionToDeg = {
  N: 0,
  W: 90,
  S: 180,
  E: 270
};

const Marker: React.FC<IMarkerProps> = ({ northMarkerTip, direction }) => {
  const compassTexture = useTexture({
    N: compassN,
    W: compassW,
    S: compassS,
    E: compassE
});

  const rotation: [number, number, number] = [0, THREE.MathUtils.degToRad(directionToDeg[direction]), 0];

  return (
    <object3D rotation={rotation}>
      <object3D position={northMarkerTip}>
        {/* <mesh position={[0, -0.5 * lineHeight, 0]}>
          <boxGeometry args={[15, lineHeight, 15]} />
          <meshBasicMaterial color={COLOR} />
        </mesh> */}
        <Line
          points={[northMarkerTip, [northMarkerTip[0], -10e6, northMarkerTip[2]]]}
          color={COLOR}
          lineWidth={3}
        />
        <sprite
          scale={[SPRITE_WIDTH, SPRITE_HEIGHT, 1]}
          center={direction === "N" ? undefined : SPRITE_CENTER}
        >
          <spriteMaterial
            map={compassTexture[direction]}
            transparent={true}
            color={COLOR}
            sizeAttenuation={false}
          />
        </sprite>
      </object3D>
    </object3D>
  );
};

interface IProps {
  northMarkerTip: [number, number, number];
}

export const CompassMarkers: React.FC<IProps> = ({ northMarkerTip }) => (
  <>
    <Marker northMarkerTip={northMarkerTip} direction="N" />
    <Marker northMarkerTip={northMarkerTip} direction="E" />
    <Marker northMarkerTip={northMarkerTip} direction="S" />
    <Marker northMarkerTip={northMarkerTip} direction="W" />
  </>
);

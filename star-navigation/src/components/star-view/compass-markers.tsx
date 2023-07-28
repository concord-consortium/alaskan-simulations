import React from "react";
import * as THREE from "three";
import { useTexture, Line } from "@react-three/drei";

import compassN from "../../assets/compass_icon_selected.png";
import compassS from "../../assets/compass_s.png";
import compassW from "../../assets/compass_w.png";
import compassE from "../../assets/compass_e.png";
import { config } from "../../config";

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

  const originalTopPoint = new THREE.Vector3(...northMarkerTip);
  const radius = originalTopPoint.length();

  const bottomPoint = new THREE.Vector3(northMarkerTip[0], 0, northMarkerTip[2]);
  bottomPoint.setLength(radius);

  let topPoint;
  if (direction === "N") {
    topPoint = northMarkerTip;
  } else {
    // S/W/E marker lines are much shorter and closer to the horizon.
    topPoint = (new THREE.Vector3(...northMarkerTip)).sub(bottomPoint).setLength(radius * 0.12);
    topPoint.add(bottomPoint);
  }

  return (
    <object3D rotation={rotation}>
      {
        // Don't render the line when landscape markers are enabled. This line will be drawn in the landscape component instead.
        !config.landscapeMarkers &&
        <Line
          points={[topPoint, bottomPoint]}
          color={COLOR}
          lineWidth={3}
        />
      }
      <sprite
        position={topPoint}
        scale={[SPRITE_WIDTH, SPRITE_HEIGHT, 1]}
        center={direction === "N" ? undefined : SPRITE_CENTER}
      >
        <spriteMaterial
          map={compassTexture[direction] as THREE.Texture}
          transparent={true}
          color={COLOR}
          sizeAttenuation={false}
        />
      </sprite>
    </object3D>
  );
};

interface IProps {
  northMarkerTip: [number, number, number];
  // It'd theoretically make sense to just not render compass marker when it's not yet selected by user. However,
  // it loads textures. And when the texture is loaded, the whole component is re-rendered which often breaks
  // camera animation (camera rotates to the selected star / compass pos). So, it's better to add it to the component
  // tree right away, so textures can be preloaded.
  visible: boolean;
}

export const CompassMarkers: React.FC<IProps> = ({ northMarkerTip, visible }) => (
  <object3D visible={visible}>
    <Marker northMarkerTip={northMarkerTip} direction="N" />
    {
      // E/S/W markers are not rendered when landscape markers are enabled.
      // These markers will be drawn in the landscape component instead.
      !config.landscapeMarkers &&
      <>
        <Marker northMarkerTip={northMarkerTip} direction="E" />
        <Marker northMarkerTip={northMarkerTip} direction="S" />
        <Marker northMarkerTip={northMarkerTip} direction="W" />
      </>
    }
  </object3D>
);

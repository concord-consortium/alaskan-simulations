import React from "react";
import * as THREE from "three";
import { IAngleMarker } from "../../types";
import { Html, Line } from "@react-three/drei";
import { getCelestialSphereRotation } from "../../utils/sim-utils";

const ANGLE_ANNOTATION_OFFSET = 50;
const MIN_ANGLE = 0.5;

interface IProps {
  angleMarker: IAngleMarker | null;
  lat: number;
  long: number;
  currentEpochTime: number;
}

export const AngleMarker: React.FC<IProps> = (props) => {
  const { angleMarker, lat, long, currentEpochTime } = props;
  if (!angleMarker?.startPoint || !angleMarker?.endPoint) {
    return null;
  }

  const originalRotation = getCelestialSphereRotation({ epochTime: angleMarker.createdAtEpoch, lat, long });
  const currentRotation = getCelestialSphereRotation({ epochTime: currentEpochTime, lat, long });

  // Angle between lines is essentially equal to rotation of the celestial sphere between two points in time,
  // and that's obviously easier to calculate.
  let rotationDiff = THREE.MathUtils.radToDeg(originalRotation[1] - currentRotation[1]) % 360;
  if (rotationDiff < 0) {
    rotationDiff += 360;
  }

  const showAngleAnnotation = rotationDiff > MIN_ANGLE && rotationDiff < (360 - MIN_ANGLE);

  let label1Pos, label2Pos, htmlCommonProps;
  if (showAngleAnnotation) {
    const start = new THREE.Vector3(...angleMarker.startPoint);
    const end = new THREE.Vector3(...angleMarker.endPoint);
    const direction = end.clone().sub(start).normalize();
    label1Pos = start.clone().sub(direction.clone().multiplyScalar(ANGLE_ANNOTATION_OFFSET));
    label2Pos = end.clone().add(direction.clone().multiplyScalar(ANGLE_ANNOTATION_OFFSET));

    htmlCommonProps = {
      center: true,
      zIndexRange: [1, 0], // default z-index range uses some enormous values and brakes daylight layer
      style: {
        color: "white",
        fontSize: 20
      }
    };
  }

  return (
    <>
      <object3D rotation={originalRotation}>
        <Line
          points={[angleMarker.startPoint, angleMarker.endPoint]}
          color="white"
          lineWidth={3}
        />
      </object3D>
      <object3D rotation={currentRotation}>
        <Line
          points={[angleMarker.startPoint, angleMarker.endPoint]}
          color="white"
          lineWidth={3}
          opacity={0.65}
          transparent={true}
        />
        {
          showAngleAnnotation &&
          <>
            <Html position={label1Pos} {...htmlCommonProps}>{ rotationDiff.toFixed(0) }°</Html>
            <Html position={label2Pos} {...htmlCommonProps}>{ rotationDiff.toFixed(0) }°</Html>
          </>
        }
      </object3D>
    </>
  );
};

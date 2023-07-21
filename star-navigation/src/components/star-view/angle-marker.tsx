import React from "react";
import { IAngleMarker } from "../../types";
import { Line } from "@react-three/drei";
import { getCelestialSphereRotation } from "../../utils/sim-utils";

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

  return (
    <>
      <object3D rotation={originalRotation}>
        <Line
          points={[angleMarker.startPoint, angleMarker.endPoint]}
          color={"white"}
          lineWidth={3}
        />
      </object3D>
      <object3D rotation={currentRotation}>
        <Line
          points={[angleMarker.startPoint, angleMarker.endPoint]}
          color={"white"}
          lineWidth={3}
          opacity={0.65}
          transparent={true}
        />
      </object3D>
    </>
  );
};

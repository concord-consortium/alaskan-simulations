import React, { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface IProps {
  radius: number;
  onStartPointChange: (startPoint: THREE.Vector3) => void;
  onEndPointChange: (endPoint: THREE.Vector3) => void;
}

export const InteractiveCelestialSphere: React.FC<IProps> = (props) => {
  const { radius, onStartPointChange, onEndPointChange } = props;

  const [pointerDown, setPointerDown] = useState(false);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    setPointerDown(true);
    onStartPointChange(event.point);
  };

  const handlePointerUp = () => {
    setPointerDown(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    onEndPointChange(event.point);
  };

  return (
    <mesh
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerMove={pointerDown ? handlePointerMove : undefined}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color="white" side={THREE.DoubleSide} opacity={0} transparent={true} />
    </mesh>
  );
};

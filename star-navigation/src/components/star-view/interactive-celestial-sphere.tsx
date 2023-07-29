import React, { useCallback } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface IProps {
  radius: number;
  onPointerDown?: (point: THREE.Vector3) => void;
  onPointerMove?: (point: THREE.Vector3) => void;
  onPointerUp?: (point: THREE.Vector3) => void;
  onPointerCancel?: (point: THREE.Vector3) => void;
}

export const InteractiveCelestialSphere: React.FC<IProps> = (props) => {
  const { radius, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = props;

  const handlePointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    onPointerDown?.(event.point);
  }, [onPointerDown]);

  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    onPointerMove?.(event.point);
  }, [onPointerMove]);

  const handlePointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    onPointerUp?.(event.point);
  }, [onPointerUp]);

  const handlePointerCancel = useCallback((event: ThreeEvent<PointerEvent>) => {
    onPointerCancel?.(event.point);
  }, [onPointerCancel]);

  return (
    <mesh
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color="white" side={THREE.DoubleSide} opacity={0} transparent={true} />
    </mesh>
  );
};

import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Shutterbug from "shutterbug";
import { config } from "../../config";
import { CelestialSphere } from "./celestial-sphere";

// This needs to be a separate component, as useThree depends on context provided by <Canvas> component.
const ShutterbugSupport = () => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const render = () => {
      gl.render(scene, camera);
    };
    Shutterbug.on("saycheese", render);
    return () => Shutterbug.off("saycheese", render);
  }, [gl, scene, camera]);
  return null;
};

interface IProps {
  epochTime: number;
  lat: number;
  long: number;
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
}

export const StarView: React.FC<IProps> = (props) => {
  // Keep Z value small, so target is very close to camera, and orbit controls behave pretty much like first person camera.
  const targetZ = 0.1;
  // This value decides about the initial camera angle.
  const targetY = Math.tan(THREE.MathUtils.degToRad(config.horizonCameraAngle)) * targetZ;

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
    // flat=true disables tone mapping that is not a default in threejs, but is enabled by default in react-three-fiber.
    // It makes textures match colors in the original image.
    // resize.debounce=0 ensures that canvas will resize immediately when container size changes (right tab animation).
    <Canvas camera={{ manual: true }} flat={true} resize={{ debounce: 0 }}>
      <PerspectiveCamera makeDefault={true} fov={config.horizonFov} position={[0, 0, 0]} />
      <OrbitControls
        target={[0, targetY, targetZ]}
        enableDamping={false}
        enableRotate={true} // disable rotation when something is being dragged
        enablePan={false}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
      <ambientLight args={[0x303030]} />
      {/* ground */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={0x228B22} side={THREE.DoubleSide} />
      </mesh>
      {/* N marker box */}
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0xff0000} side={THREE.DoubleSide} />
      </mesh>
      <CelestialSphere {...props} />
      <ShutterbugSupport />
    </Canvas>
  );
};

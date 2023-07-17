import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsChangeEvent, PerspectiveCamera } from "@react-three/drei";
import Shutterbug from "shutterbug";
import { config } from "../../config";
import { CelestialSphere } from "./celestial-sphere";
import { getCelestialSphereRotation, getStarPositionAtTime, toPositiveHeading } from "../../utils/sim-utils";
import { CompassMarkers } from "./compass-markers";

const CELESTIAL_SPHERE_RADIUS = 1000;

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
  onStarClick: (starHip: number) => void;
  onRealHeadingFromNorthChange: (heading: number) => void;
  selectedStarHip: number | null;
  compassActive: boolean;
}

export const StarView: React.FC<IProps> = (props) => {
  const { epochTime, lat, long, selectedStarHip, compassActive, showWesternConstellations, showYupikConstellations,
    onStarClick, onRealHeadingFromNorthChange } = props;

  // Keep Z value small, so target is very close to camera, and orbit controls behave pretty much like first person camera.
  const targetZ = -0.1;
  // This value decides about the initial camera angle.
  const targetY = Math.tan(THREE.MathUtils.degToRad(config.horizonCameraAngle)) * -targetZ;

  const celestialSphereRotation = getCelestialSphereRotation({ epochTime, lat, long });

  let northMarkerTip;
  if (selectedStarHip) {
    northMarkerTip = getStarPositionAtTime({
      starHip: selectedStarHip,
      celestialSphereRadius: 0.8 * CELESTIAL_SPHERE_RADIUS,
      epochTime, lat, long
     });
  }

  const handleCameraUpdate = (event?: OrbitControlsChangeEvent) => {
    if (event) {
      onRealHeadingFromNorthChange(toPositiveHeading(THREE.MathUtils.radToDeg(event.target.getAzimuthalAngle())));
    }
  };

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
        onChange={handleCameraUpdate}
      />
      <ambientLight args={[0x303030]} />
      {/* ground */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial color={0x228B22} side={THREE.DoubleSide} />
      </mesh>
      {/* N marker box */}
      <mesh position={[0, 0, -10]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0xff0000} side={THREE.DoubleSide} />
      </mesh>
      {/* S marker box */}
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0xffff00} side={THREE.DoubleSide} />
      </mesh>
      {/* E marker box */}
      <mesh position={[10, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x00ff00} side={THREE.DoubleSide} />
      </mesh>
      {/* W marker box */}
      <mesh position={[-10, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x0000ff} side={THREE.DoubleSide} />
      </mesh>
      <CelestialSphere
        radius={CELESTIAL_SPHERE_RADIUS}
        rotation={celestialSphereRotation}
        showWesternConstellations={showWesternConstellations}
        showYupikConstellations={showYupikConstellations}
        onStarClick={onStarClick}
        compassActive={compassActive}
      />
      {
        northMarkerTip &&
        <CompassMarkers northMarkerTip={[northMarkerTip.x, northMarkerTip.y, northMarkerTip.z]} />
      }
      <ShutterbugSupport />
    </Canvas>
  );
};

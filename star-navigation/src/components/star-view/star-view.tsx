import React, { useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsChangeEvent, PerspectiveCamera } from "@react-three/drei";
import Shutterbug from "shutterbug";
import { config } from "../../config";
import { CelestialSphere } from "./celestial-sphere";
import { getCelestialSphereRotation, getStarPositionAtTime, toNegativeHeading, toPositiveHeading } from "../../utils/sim-utils";
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
  realHeadingFromNorth: number;
  onRealHeadingFromNorthChange: (heading: number) => void;
  selectedStarHip: number | null;
  compassActive: boolean;
}

export const StarView: React.FC<IProps> = (props) => {
  const { epochTime, lat, long, selectedStarHip, compassActive, showWesternConstellations, showYupikConstellations,
    onStarClick, realHeadingFromNorth, onRealHeadingFromNorthChange } = props;

  const orbitControlsRef = useRef<any>(null);
  const cameraHeadingUpdate = useRef<number>(-1);

  // Keep Z value small, so target is very close to camera, and orbit controls behave pretty much like first person camera.
  const targetX = 0.1;
  // This value decides about the initial camera angle.
  const targetY = Math.tan(THREE.MathUtils.degToRad(config.horizonCameraAngle)) * targetX;

  const celestialSphereRotation = getCelestialSphereRotation({ epochTime, lat, long });

  let northMarkerTip;
  if (selectedStarHip) {
    northMarkerTip = getStarPositionAtTime({
      starHip: selectedStarHip,
      celestialSphereRadius: CELESTIAL_SPHERE_RADIUS,
      epochTime, lat, long
     });
  }

  const handleCameraUpdate = (event?: OrbitControlsChangeEvent) => {
    if (event) {
      const newHeading = toPositiveHeading(THREE.MathUtils.radToDeg(event.target.getAzimuthalAngle()));
      if (newHeading !== realHeadingFromNorth) {
        // Camera damping generates lots of events, so we need to debounce them.
        window.clearTimeout(cameraHeadingUpdate.current);
        cameraHeadingUpdate.current = window.setTimeout(() => {
          onRealHeadingFromNorthChange(newHeading);
        }, 300);
      }
    }
  };

  useLayoutEffect(() => {
    if (orbitControlsRef.current?.getAzimuthalAngle() !== THREE.MathUtils.degToRad(realHeadingFromNorth)) {
      const newHeading = toNegativeHeading(THREE.MathUtils.degToRad(realHeadingFromNorth));
      orbitControlsRef.current?.setAzimuthalAngle(newHeading);
    }
  }, [realHeadingFromNorth]);

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
    // flat=true disables tone mapping that is not a default in threejs, but is enabled by default in react-three-fiber.
    // It makes textures match colors in the original image.
    // resize.debounce=0 ensures that canvas will resize immediately when container size changes (right tab animation).
    <Canvas camera={{ manual: true }} flat={true} resize={{ debounce: 0 }}>
      <PerspectiveCamera makeDefault={true} fov={config.horizonFov} position={[0, 0, 0]} near={0.1} far={CELESTIAL_SPHERE_RADIUS * 5} />
      <OrbitControls
        ref={orbitControlsRef}
        target={[targetX, targetY, 0]}
        enableDamping={true}
        enableRotate={config.freeCamera}
        enableZoom={config.freeCamera}
        enablePan={false}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        onChange={handleCameraUpdate}
      />
      <ambientLight args={[0x303030]} />
      {
        config.freeCamera &&
        <>
          {/* ground */}
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshBasicMaterial color={0x228B22} side={THREE.BackSide} />
          </mesh>
          {/* N marker box */}
          <mesh position={[0, 0, -1000]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color={0xff0000} side={THREE.DoubleSide} />
          </mesh>
          {/* S marker box */}
          <mesh position={[0, 0, 1000]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color={0xffff00} side={THREE.DoubleSide} />
          </mesh>
          {/* E marker box */}
          <mesh position={[1000, 0, 0]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color={0x00ff00} side={THREE.DoubleSide} />
          </mesh>
          {/* W marker box */}
          <mesh position={[-1000, 0, 0]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color={0x0000ff} side={THREE.DoubleSide} />
          </mesh>
        </>
      }
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

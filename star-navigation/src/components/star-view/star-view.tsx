import React, { useEffect, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsChangeEvent, PerspectiveCamera } from "@react-three/drei";
import Shutterbug from "shutterbug";
import { config } from "../../config";
import { CelestialSphere } from "./celestial-sphere";
import { getCelestialSphereRotation, getStarPositionAtTime, toNegativeHeading, toPositiveHeading } from "../../utils/sim-utils";
import { CompassMarkers } from "./compass-markers";
import { InteractiveCelestialSphere } from "./interactive-celestial-sphere";
import { IAngleMarker } from "../../types";
import { AngleMarker } from "./angle-marker";

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

const getInitialCameraPosition = (headingFromNorth: number) => {
  // North direction follows negative Z axis.
  // So, position camera behind the (0, 0, 0) point, looking at it, towards negative Z axis => north.
  const cameraZ = 0.1;
  // This value decides about the initial camera angle.
  const cameraY = Math.tan(THREE.MathUtils.degToRad(config.cameraVerticalAngle)) * -cameraZ;
  // Finally rotate the camera by desired heading from north.
  const pos = new THREE.Vector3(0, cameraY, cameraZ);
  pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-headingFromNorth));
  return pos.toArray();
};

interface IProps {
  epochTime: number;
  lat: number;
  long: number;
  showWesternConstellations: boolean;
  showYupikConstellations: boolean;
  realHeadingFromNorth: number;
  selectedStarHip: number | null;
  angleMarker: IAngleMarker | null;
  compassInteractionActive: boolean;
  angleMarkerInteractionActive: boolean;
  onStarClick: (starHip: number) => void;
  onRealHeadingFromNorthChange: (heading: number) => void;
  onAngleMarkerStartPointChange: (startPoint: THREE.Vector3) => void;
  onAngleMarkerEndPointChange: (endPoint: THREE.Vector3) => void;
}

export const StarView: React.FC<IProps> = (props) => {
  const {
    epochTime, lat, long, showWesternConstellations, showYupikConstellations, realHeadingFromNorth,
    selectedStarHip, angleMarker, angleMarkerInteractionActive, compassInteractionActive,
    onRealHeadingFromNorthChange, onStarClick, onAngleMarkerStartPointChange, onAngleMarkerEndPointChange
  } = props;

  const orbitControlsRef = useRef<any>(null);
  const cameraHeadingUpdate = useRef(-1);

  // Setting initial camera and its further updates is pretty confusing. As long as OrbitControls are not instantiated,
  // we need to keep updating camera position manually. Once OrbitControls are instantiated, camera position is updated
  // via useLayoutEffect below that calls OrbitControls.setAzimuthalAngle.
  const initialCameraPos = useRef(getInitialCameraPosition(realHeadingFromNorth));
  if (!orbitControlsRef.current) {
    initialCameraPos.current = getInitialCameraPosition(realHeadingFromNorth);
  }

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
    if (orbitControlsRef.current && orbitControlsRef.current.getAzimuthalAngle() !== THREE.MathUtils.degToRad(realHeadingFromNorth)) {
      const newHeading = toNegativeHeading(THREE.MathUtils.degToRad(realHeadingFromNorth));
      orbitControlsRef.current.setAzimuthalAngle(newHeading);
    }
  }, [realHeadingFromNorth]);

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
    // flat=true disables tone mapping that is not a default in threejs, but is enabled by default in react-three-fiber.
    // It makes textures match colors in the original image.
    // resize.debounce=0 ensures that canvas will resize immediately when container size changes (right tab animation).
    <Canvas camera={{ manual: true }} flat={true} resize={{ debounce: 0 }}>
      <PerspectiveCamera
        makeDefault={true}
        position={initialCameraPos.current}
        fov={config.horizonFov}
        near={0.1}
        far={CELESTIAL_SPHERE_RADIUS * 5}
      />
      <OrbitControls
        ref={orbitControlsRef}
        target={[0, 0, 0]}
        enableDamping={true}
        enableRotate={config.freeCamera && !compassInteractionActive && !angleMarkerInteractionActive}
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
            <planeGeometry args={[3000, 3000]} />
            <meshBasicMaterial color={0x228B22} side={THREE.BackSide} />
          </mesh>
          {/* N marker box */}
          <mesh position={[0, 0, -1000]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color="red" side={THREE.DoubleSide} />
          </mesh>
          {/* S marker box */}
          <mesh position={[0, 0, 1000]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color="yellow" side={THREE.DoubleSide} />
          </mesh>
          {/* E marker box */}
          <mesh position={[1000, 0, 0]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color="green" side={THREE.DoubleSide} />
          </mesh>
          {/* W marker box */}
          <mesh position={[-1000, 0, 0]}>
            <boxGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color="blue" side={THREE.DoubleSide} />
          </mesh>
        </>
      }
      <CelestialSphere
        radius={CELESTIAL_SPHERE_RADIUS}
        rotation={celestialSphereRotation}
        showWesternConstellations={showWesternConstellations}
        showYupikConstellations={showYupikConstellations}
        onStarClick={onStarClick}
        compassInteractionActive={compassInteractionActive}
      />
      {
        angleMarkerInteractionActive &&
        <InteractiveCelestialSphere
          radius={CELESTIAL_SPHERE_RADIUS}
          onStartPointChange={onAngleMarkerStartPointChange}
          onEndPointChange={onAngleMarkerEndPointChange}
        />
      }
      {
        angleMarker &&
        <AngleMarker angleMarker={angleMarker} lat={lat} long={long} currentEpochTime={epochTime} />
      }
      {
        northMarkerTip &&
        <CompassMarkers northMarkerTip={[northMarkerTip.x, northMarkerTip.y, northMarkerTip.z]} />
      }
      <ShutterbugSupport />
    </Canvas>
  );
};

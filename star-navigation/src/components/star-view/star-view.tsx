import React, { useEffect, useCallback, useRef, useLayoutEffect } from "react";
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
import { InteractiveStars } from "./interactive-stars";

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

// This needs to be a separate component, as useThree depends on context provided by <Canvas> component.
const TakeSnapshot: React.FC<{ onSnapshotReady: (snapshot: string ) => void }> = ({ onSnapshotReady }) => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.render(scene, camera);
    // Note that this image will be saved in the app state that is later saved in Firestore. There's 1MB limit for
    // Firestore documents, so image size is important (we'll have four of them). JPEG with 0.25 ensures reasonable
    // quality and the size is around 35-50kB, so very safe. In comparison, PNG is around 500kB, so it's not an option.
    const image = gl.domElement.toDataURL("image/jpeg", 0.25);
    onSnapshotReady(image);
  }, [gl, scene, camera, onSnapshotReady]);
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
  assumedNorthStarHip: number | null;
  angleMarker: IAngleMarker | null;
  compassInteractionActive: boolean;
  angleMarkerInteractionActive: boolean;
  onAssumedNorthStarClick: (starHip: number) => void;
  onRealHeadingFromNorthChange: (heading: number) => void;
  onAngleMarkerStartPointChange: (startPoint: THREE.Vector3) => void;
  onAngleMarkerEndPointChange: (endPoint: THREE.Vector3) => void;
  onAngleMarkerFinalize: (endPoint: THREE.Vector3) => void;
  onAngleMarkerCancel: () => void;
  snapshotRequested: boolean;
  onSnapshotReady: (snapshot: string) => void;
}

export const StarView: React.FC<IProps> = (props) => {
  const {
    epochTime, lat, long, showWesternConstellations, showYupikConstellations, realHeadingFromNorth,
    assumedNorthStarHip, angleMarker, angleMarkerInteractionActive, compassInteractionActive,
    onRealHeadingFromNorthChange, onAssumedNorthStarClick, onAngleMarkerStartPointChange, onAngleMarkerEndPointChange,
    onAngleMarkerFinalize, onAngleMarkerCancel, snapshotRequested, onSnapshotReady
  } = props;

  const orbitControlsRef = useRef<any>(null);
  const cameraHeadingUpdate = useRef(-1);
  const angleMarkerDrawingActive = useRef<boolean>(false);

  // Setting initial camera and its further updates is pretty confusing. As long as OrbitControls are not instantiated,
  // we need to keep updating camera position manually. Once OrbitControls are instantiated, camera position is updated
  // via useLayoutEffect below that calls OrbitControls.setAzimuthalAngle.
  const initialCameraPos = useRef(getInitialCameraPosition(realHeadingFromNorth));
  if (!orbitControlsRef.current) {
    initialCameraPos.current = getInitialCameraPosition(realHeadingFromNorth);
  }

  const celestialSphereRotation = getCelestialSphereRotation({ epochTime, lat, long });

  let northMarkerTip;
  if (assumedNorthStarHip) {
    northMarkerTip = getStarPositionAtTime({
      starHip: assumedNorthStarHip,
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

  const handleStarClick = (position: THREE.Vector3, starHip: number) => {
    onAssumedNorthStarClick(starHip);
  };

  const handleAngleMarkerPointerDown = (position: THREE.Vector3, starHip: number) => {
    onAngleMarkerStartPointChange(position);
    angleMarkerDrawingActive.current = true;
  };

  const handleAngleMarkerPointerUp = (position: THREE.Vector3, starHip: number) => {
    onAngleMarkerFinalize(position);
    angleMarkerDrawingActive.current = false;
  };

  const handleAngleMarkerPointerMove = (position: THREE.Vector3) => {
    if (angleMarkerDrawingActive.current) {
      onAngleMarkerEndPointChange(position);
    }
  };

  const handleAngleMarkerCancel = useCallback(() => {
    if (angleMarkerDrawingActive.current) {
      onAngleMarkerCancel();
      angleMarkerDrawingActive.current = false;
    }
  }, [onAngleMarkerCancel]);

  useLayoutEffect(() => {
    if (orbitControlsRef.current && orbitControlsRef.current.getAzimuthalAngle() !== THREE.MathUtils.degToRad(realHeadingFromNorth)) {
      const newHeading = toNegativeHeading(THREE.MathUtils.degToRad(realHeadingFromNorth));
      orbitControlsRef.current.setAzimuthalAngle(newHeading);
    }
  }, [realHeadingFromNorth]);


  // The useEffect below ensures that if user continues dragging outside the canvas and releases the mouse button/tap,
  // the dragging will be cancelled and won't get stuck.
  useEffect(() => {
    window.addEventListener("pointerup", handleAngleMarkerCancel);
    return () => {
      window.removeEventListener("pointerup", handleAngleMarkerCancel);
    };
  }, [handleAngleMarkerCancel]);

  return (
    // See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
    // flat=true disables tone mapping that is not a default in threejs, but is enabled by default in react-three-fiber.
    // It makes textures match colors in the original image.
    // resize.debounce=0 ensures that canvas will resize immediately when container size changes (right tab animation).
    // gl.preserveDrawingBuffer=true is needed for snapshots to work.
    <Canvas camera={{ manual: true }} flat={true} resize={{ debounce: 0 }} gl={{ preserveDrawingBuffer: true }}>
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
      />
      {
        (compassInteractionActive || angleMarkerInteractionActive) &&
        <InteractiveStars
          radius={CELESTIAL_SPHERE_RADIUS * 1.2}
          rotation={celestialSphereRotation}
          onStarClick={compassInteractionActive ? handleStarClick : undefined}
          onStarPointerDown={angleMarkerInteractionActive ? handleAngleMarkerPointerDown : undefined}
          onStarPointerUp={angleMarkerInteractionActive ? handleAngleMarkerPointerUp : undefined}
        />
      }
      {
        angleMarkerInteractionActive &&
        <InteractiveCelestialSphere
          radius={CELESTIAL_SPHERE_RADIUS * 1.2}
          onPointerMove={handleAngleMarkerPointerMove}
          onPointerUp={handleAngleMarkerCancel}
          onPointerCancel={handleAngleMarkerCancel}
        />
      }
      {
        angleMarker &&
        <AngleMarker angleMarker={angleMarker} lat={lat} long={long} currentEpochTime={epochTime} />
      }
      {/*
        It'd theoretically make sense to just not render compass marker when it's not yet selected by user. However,
        it loads textures. And when the texture is loaded, the whole component is re-rendered which often breaks
        camera animation (camera rotates to the selected star / compass pos). So, it's better to add it to the component
        tree right away, so textures can be preloaded.
      */}
      <CompassMarkers
        visible={!!northMarkerTip}
        northMarkerTip={northMarkerTip ? [northMarkerTip.x, northMarkerTip.y, northMarkerTip.z] : [0, 0, 0]}
      />
      <ShutterbugSupport />
      {
        snapshotRequested &&
        <TakeSnapshot onSnapshotReady={onSnapshotReady} />
      }
    </Canvas>
  );
};

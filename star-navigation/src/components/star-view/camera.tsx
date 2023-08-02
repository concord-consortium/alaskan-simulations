import React, { useCallback, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrbitControlsChangeEvent, PerspectiveCamera } from "@react-three/drei";
import { config } from "../../config";
import { toNegativeHeading, toPositiveHeading } from "../../utils/sim-utils";

const getInitialCameraPosition = (headingFromNorth: number) => {
  // North direction follows negative Z axis.
  // So, position camera behind the (0, 0, 0) point, looking at it, towards negative Z axis => north.
  const cameraZ = 0.1;
  // This value decides about the initial camera angle.
  const cameraY = Math.tan(THREE.MathUtils.degToRad(config.cameraVerticalAngle)) * -cameraZ;
  // Finally rotate the camera by desired heading from north.
  const pos = new THREE.Vector3(0, cameraY, cameraZ);
  pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(-headingFromNorth));
  return pos;
};

interface IProps {
  realHeadingFromNorth: number;
  onRealHeadingFromNorthChange: (heading: number) => void;
  celestialSphereRadius: number;
  anyInteractionActive: boolean;
}

export const Camera: React.FC<IProps> = ({ realHeadingFromNorth, onRealHeadingFromNorthChange, anyInteractionActive, celestialSphereRadius }) => {
  const cameraHeadingUpdate = useRef(-1);
  const orbitControlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Setting initial camera and its further updates is pretty confusing. As long as OrbitControls are not instantiated,
  // we need to keep updating camera position manually. Once OrbitControls are instantiated, camera position is updated
  // via another useLayoutEffect below that calls OrbitControls.setAzimuthalAngle.
  useLayoutEffect(() => {
    if (!orbitControlsRef.current) {
      camera.position.copy(getInitialCameraPosition(realHeadingFromNorth));
      camera.lookAt(0, 0, 0); // important due to way how we simulate FPV camera
      camera.updateProjectionMatrix();
    }
  }, [camera, realHeadingFromNorth]);

  useLayoutEffect(() => {
    if (orbitControlsRef.current && orbitControlsRef.current.getAzimuthalAngle() !== THREE.MathUtils.degToRad(realHeadingFromNorth)) {
      const newHeading = toNegativeHeading(THREE.MathUtils.degToRad(realHeadingFromNorth));
      orbitControlsRef.current.setAzimuthalAngle(newHeading);
    }
  }, [realHeadingFromNorth]);

  const handleCameraUpdate = useCallback((event?: OrbitControlsChangeEvent) => {
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
  }, [onRealHeadingFromNorthChange, realHeadingFromNorth]);

  return (
    <>
      <PerspectiveCamera
        makeDefault={true}
        position={orbitControlsRef.current ? undefined : getInitialCameraPosition(realHeadingFromNorth)}
        fov={config.horizonFov}
        near={0.1}
        far={celestialSphereRadius * 5}
      />
      <OrbitControls
        ref={orbitControlsRef}
        target={[0, 0, 0]}
        enableDamping={true}
        enableRotate={config.freeCamera && !anyInteractionActive}
        enableZoom={config.freeCamera}
        enablePan={false}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        onChange={handleCameraUpdate}
      />
    </>
  );
};

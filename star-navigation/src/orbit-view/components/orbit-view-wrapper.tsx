import React from "react";
import { config } from "../../config";
import * as THREE from "three";
import CanvasView from "./canvas-view";

import css from "./orbit-view-wrapper.scss";

interface IProps {
  epochTime: number;
  observerLat: number;
  observerLon: number;
  cameraRotation: number;
  showConstellations: boolean;
  showDaylight: boolean;
  tiltCamera: boolean;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;
// This offset ensures that Greenwich (long = 0) is facing the sun at 12:00 UTC.
const EARTH_ROTATION_OFFSET = THREE.MathUtils.degToRad(12);

export const OrbitViewWrapper: React.FC<IProps> = ({ epochTime, observerLat, observerLon, cameraRotation, showConstellations, showDaylight, tiltCamera }) => {
  // Orbit View assumes that day = 0 is UTC noon at Greenwich (longitude = 0).
  const dayOfYear = (new Date(epochTime).getTime() - new Date("2022-01-01T12:00:00Z").getTime()) / DAY_IN_MS;
  // After applying EARTH_ROTATION_OFFSET, earthRotation = 0 is UTC noon at Greenwich (longitude = 0).
  const earthRotation = (dayOfYear % 1) * Math.PI * 2;

  return (
    <div className={css.orbitViewWrapper}>
      <CanvasView
        simulation={{
          day: dayOfYear,
          earthRotation: EARTH_ROTATION_OFFSET + earthRotation,
          lat: observerLat,
          long: observerLon,
          observerCameraAngle: config.horizonCameraAngle,
          earthTilt: true,
          sunEarthLine: false,
          cameraRotation,
          showConstellations,
          showDaylight,
          tiltCamera
        }}
      />
    </div>
  );
};

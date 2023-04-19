import * as THREE from "three";
import * as data from "../solar-system-data";

// Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always
// be 1 regardless of the set value. See:
// https://threejs.org/docs/index.html?q=LineBasicMaterial#api/en/materials/LineBasicMaterial.linewidth
// To workaround, this function will create X orbit lines next to each other.
// Finally, they would look like one but thicker.
const baseMaterial = new THREE.LineBasicMaterial({color: 0xafdedf, transparent: true, opacity: 1, linewidth: 1});

// Note that it's not possible to simply set dash and gap size to a constant value, as each circle has slightly different
// radius. We want each circle to have exactly the same amount of dashes. It seems like a small difference, but without
// these precise calculations, dashed look totally incorrect. Small offset builds up and at the end of the circle
// dashes are fully off.
const kDashCount = 200;
const getDashedMaterial = (radius: number) => {
  const dashAndGapSize = (Math.PI * radius * 2) / kDashCount;
  return new THREE.LineDashedMaterial({
    color: 0xafdedf,
    transparent: true,
    opacity: 1,
    linewidth: 1,
    gapSize: dashAndGapSize,
    dashSize: dashAndGapSize,
    scale: 1
  });
};

const getArc = (props: { startDay: number, endDay: number, dashed: boolean, width: number }) => {
  const { startDay, endDay, dashed, width } = props;

  const container = new THREE.Object3D;
  const startAngle = ((data.SUMMER_SOLSTICE - startDay) / 365) * 2 * Math.PI;
  const endAngle = ((data.SUMMER_SOLSTICE - endDay) / 365) * 2 * Math.PI;

  for (let i = 0; i < width; i += 1) {
    // * 5 is based on empirical tests, it provides enough visual spreading between lines to make them look like one
    // thick line.
    const radiusOffset = (-width * 0.5 + i) * 5;
    const curve = new THREE.EllipseCurve(
      data.SUN_FOCUS * 2, 0, // aX, aY
      data.EARTH_SEMI_MAJOR_AXIS * data.EARTH_ORBITAL_RADIUS + radiusOffset, data.EARTH_ORBITAL_RADIUS + radiusOffset, // xRadius, yRadius
      startAngle, endAngle,
      true, // aClockwise
      0 // no rotation
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(150));

    const avgRadius = 0.5 * ((data.EARTH_SEMI_MAJOR_AXIS * data.EARTH_ORBITAL_RADIUS + radiusOffset) + (data.EARTH_ORBITAL_RADIUS + radiusOffset));
    const mesh = new THREE.Line(geometry, dashed ? getDashedMaterial(avgRadius) : baseMaterial);

    mesh.computeLineDistances();
    mesh.rotateX(Math.PI / 2);

    container.add(mesh);
  }
  return container;
};

export class Orbit {
  rootObject = new THREE.Object3D();

  constructor() {
    const mainOrbitLine = getArc({
      width: 6,
      dashed: false,
      startDay: 0,
      endDay: 365
    });
    this.rootObject.add(mainOrbitLine);
  }
}

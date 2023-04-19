import * as THREE from "three";
import * as c from "./constants";

const DEF_EMISSIVE = 0x999999;

const BASE_RADIUS = c.SF * 2000000;
const BASE_LENGTH = BASE_RADIUS * 15;
const SEGMENTS = 16;

const getArrowBase = (material: THREE.Material) => {
  const geometry = new THREE.CylinderGeometry(BASE_RADIUS, BASE_RADIUS, BASE_LENGTH, SEGMENTS);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = BASE_LENGTH * 0.50;
  mesh.rotation.z = Math.PI * 0.5;
  return mesh;
};

const getArrowHead = (material: THREE.Material) => {
  const geometry = new THREE.CylinderGeometry(BASE_RADIUS * 2.5, 0, BASE_LENGTH * 0.3, SEGMENTS);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = BASE_LENGTH * 1.15;
  mesh.rotation.z = Math.PI * 0.5;
  return mesh;
};

export class ObserverArrow {
  material: THREE.MeshPhongMaterial;
  pivot: THREE.Object3D;
  rootObject: THREE.Object3D;

  constructor() {
    const material = new THREE.MeshPhongMaterial({ emissive: DEF_EMISSIVE });
    const arrowBaseMesh = getArrowBase(material);
    const arrowHeadMesh = getArrowHead(material);
    this.pivot = new THREE.Object3D();
    this.pivot.add(arrowBaseMesh);
    this.pivot.add(arrowHeadMesh);

    this.pivot.position.x = c.SIMPLE_EARTH_RADIUS;

    const container = new THREE.Object3D();
    container.add(this.pivot);

    this.rootObject = container;
    this.material = material;
  }

  setLatLong(lat?: number, long?: number) {
    if (lat != null) {
      lat = THREE.MathUtils.degToRad(lat);
      this.rootObject.rotation.z = lat;
    }
    if (long != null) {
      long = THREE.MathUtils.degToRad(long);
      this.rootObject.rotation.y = long;
    }
  }

  setCameraAngle(angleDeg: number) {
    this.pivot.rotation.z = -THREE.MathUtils.degToRad(90 - angleDeg);
  }
}

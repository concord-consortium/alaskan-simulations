import * as THREE from "three";

export const ambientLight = () => {
  return new THREE.AmbientLight(0x303030);
};

export const horizon = () => {
  const geometry = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshBasicMaterial({color: 0x228B22, side: THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -0.1;
  mesh.rotation.x = Math.PI / 2;
  return mesh;
};

export const box = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

import * as THREE from "three";
import * as c from "./constants";
import sunVisibleImage from "../assets/orbital-sun.png";
import sunDottedImage from "../assets/orbital-sun-off.png";

export default {
  ambientLight() {
    return new THREE.AmbientLight(0x303030);
  },

  sunLight() {
    return new THREE.PointLight(0xffffff, 1.2, 0);
  },

  // Light that affects only sun object (due to radius settings).
  sunOnlyLight() {
    const light = new THREE.PointLight(0xffffff, 1, c.SUN_RADIUS * 5);
    light.position.y = c.SUN_RADIUS * 4;
    return light;
  },

  sunSprite(visible: boolean) {
    // * 8 to match the final size with UI specs.
    const size = 8 * c.SIMPLE_SUN_RADIUS;
    const texture = new THREE.TextureLoader().load(visible ? sunVisibleImage : sunDottedImage, () => {
      const aspectRatio = texture.image.width / texture.image.height;
      sprite.scale.copy(new THREE.Vector3(size * aspectRatio, size, 1));
    });
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    return sprite;
  },

  earthAxis () {
    const HEIGHT = 60000000 * c.SF;
    const RADIUS = 2500000 * c.SF;
    // const HEAD_HEIGHT = HEIGHT * (simple ? 0.2 : 0.05);
    const EMISSIVE_COL = 0x770000;
    const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
    const material = new THREE.MeshPhongMaterial({color: 0xff0000, emissive: EMISSIVE_COL});
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
};

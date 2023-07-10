import * as THREE from "three";
import { config } from "../../config";

const DEF_COLOR = 0xffffff;

export const SF = 1 / 100000;
export const SIMPLE_EARTH_RADIUS = 118000000 * SF;
export const HIGHLIGHT_COLOR = 0xff0000;
export const HIGHLIGHT_EMISSIVE = 0xbb3333;

export default class CustomConstellations {
  _earthObject: THREE.Mesh;
  _material: THREE.MeshBasicMaterial;

  constructor() {
    const RADIUS = 10200;
    const COLORS = {color: DEF_COLOR};

    const geometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    this._material = new THREE.MeshBasicMaterial(COLORS);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(config.constellations);
    this._material.opacity = config.constellationsOpacity;
    this._material.map = texture;
    this._material.map.wrapS = THREE.RepeatWrapping;
    this._material.map.repeat.x = - 1;
    this._material.side = THREE.BackSide;
    this._material.transparent = true;


    this._earthObject = new THREE.Mesh(geometry, this._material);
  }

  get rootObject() {
    return this._earthObject;
  }
}
